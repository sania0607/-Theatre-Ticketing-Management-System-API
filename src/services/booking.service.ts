import { pool } from "../config/database";

export const createBooking = async (booking: any) => {
  const {
    show_id,
    aggregator_name,
    booking_reference,
    booking_status,
    total_amount,
    booked_at,
  } = booking;

  const result = await pool.query(
    `INSERT INTO booking
    (show_id, aggregator_name, booking_reference, booking_status, total_amount, booked_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      show_id,
      aggregator_name,
      booking_reference,
      booking_status,
      total_amount,
      booked_at,
    ]
  );

  return result.rows[0];
};

export const getAllBookings = async () => {
  const result = await pool.query(
    "SELECT * FROM booking ORDER BY id"
  );

  return result.rows;
};

export const getBookingById = async (id: number) => {
  const result = await pool.query(
    "SELECT * FROM booking WHERE id = $1",
    [id]
  );

  return result.rows[0];
};

export const updateBooking = async (id: number, booking: any) => {
  const {
    show_id,
    aggregator_name,
    booking_reference,
    booking_status,
    total_amount,
    booked_at,
  } = booking;

  const result = await pool.query(
    `UPDATE booking
     SET show_id = $1,
         aggregator_name = $2,
         booking_reference = $3,
         booking_status = $4,
         total_amount = $5,
         booked_at = $6
     WHERE id = $7
     RETURNING *`,
    [
      show_id,
      aggregator_name,
      booking_reference,
      booking_status,
      total_amount,
      booked_at,
      id,
    ]
  );

  return result.rows[0];
};

export const deleteBooking = async (id: number) => {
  const result = await pool.query(
    "DELETE FROM booking WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0];
};
export const createBookingWithSeat = async (
  booking: any,
  showSeatId: number
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check and lock the show seat
    const seatResult = await client.query(
      `SELECT *
       FROM show_seat
       WHERE id = $1
       FOR UPDATE`,
      [showSeatId]
    );

    const showSeat = seatResult.rows[0];

    if (!showSeat) {
      throw new Error("Show seat not found");
    }

    if (showSeat.status === "booked") {
      throw new Error("Seat is already booked");
    }

    if (
      showSeat.status === "locked" &&
      showSeat.locked_until &&
      new Date(showSeat.locked_until) > new Date()
    ) {
      // Seat is currently locked, so don't allow another booking
      throw new Error("Seat is currently locked");
    }

    // Create booking
    const bookingResult = await client.query(
      `INSERT INTO booking
        (show_id, aggregator_name, booking_reference,
         booking_status, total_amount, booked_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        booking.show_id,
        booking.aggregator_name,
        booking.booking_reference,
        booking.booking_status,
        booking.total_amount,
        booking.booked_at || new Date(),
      ]
    );

    const newBooking = bookingResult.rows[0];

    // Create booking_seat
    await client.query(
      `INSERT INTO booking_seat
        (booking_id, show_seat_id)
       VALUES ($1, $2)`,
      [newBooking.id, showSeatId]
    );

    // Mark seat as booked
    await client.query(
      `UPDATE show_seat
       SET status = 'booked',
           locked_until = NULL
       WHERE id = $1`,
      [showSeatId]
    );

    await client.query("COMMIT");

    return newBooking;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
export const confirmBooking = async (
  bookingReference: string
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Find and lock the booking
    const bookingResult = await client.query(
      `SELECT *
       FROM booking
       WHERE booking_reference = $1
       FOR UPDATE`,
      [bookingReference]
    );

    const booking = bookingResult.rows[0];

    if (!booking) {
      throw new Error("Booking not found");
    }

    // 2. Booking must be PENDING
    if (booking.booking_status !== "PENDING") {
      throw new Error("Booking is not pending");
    }

    // 3. Find the show seat connected to this booking
    const seatResult = await client.query(
      `SELECT ss.*
       FROM show_seat ss
       JOIN booking_seat bs
         ON bs.show_seat_id = ss.id
       WHERE bs.booking_id = $1
       FOR UPDATE`,
      [booking.id]
    );

    const showSeat = seatResult.rows[0];

    if (!showSeat) {
      throw new Error("Show seat not found");
    }

    // 4. Check whether the lock has expired
    if (
      showSeat.status !== "locked" ||
      !showSeat.locked_until ||
      new Date(showSeat.locked_until) <= new Date()
    ) {
      throw new Error("Seat lock has expired");
    }

    // 5. Confirm the booking
    const updatedBookingResult = await client.query(
      `UPDATE booking
       SET booking_status = 'CONFIRMED'
       WHERE id = $1
       RETURNING *`,
      [booking.id]
    );

    // 6. Mark the seat as booked
    const updatedSeatResult = await client.query(
      `UPDATE show_seat
       SET status = 'booked',
           locked_until = NULL
       WHERE id = $1
       RETURNING *`,
      [showSeat.id]
    );

    await client.query("COMMIT");

    return {
      booking: updatedBookingResult.rows[0],
      showSeat: updatedSeatResult.rows[0],
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};