import { pool } from "../config/database";
import Booking from "../models/booking.model";

// CREATE BOOKING


export const createBooking = async (booking: any) => {
  const {
    show_id,
    aggregator_name,
    booking_reference,
    booking_status,
    total_amount,
    booked_at,
  } = booking;

  const newBooking = await Booking.create({
    show_id,
    aggregator_name,
    booking_reference,
    booking_status,
    total_amount,
    booked_at,
  });

  return newBooking;
};


// GET ALL BOOKINGS


export const getAllBookings = async () => {
  const bookings = await Booking.findAll({
    order: [["id", "ASC"]],
  });

  return bookings;
};

// GET BOOKING BY ID

export const getBookingById = async (id: number) => {
  const booking = await Booking.findByPk(id);

  return booking;
};


// UPDATE BOOKING


export const updateBooking = async (
  id: number,
  booking: any
) => {
  const existingBooking = await Booking.findByPk(id);

  if (!existingBooking) {
    return null;
  }

  await existingBooking.update({
    show_id: booking.show_id,
    aggregator_name: booking.aggregator_name,
    booking_reference: booking.booking_reference,
    booking_status: booking.booking_status,
    total_amount: booking.total_amount,
    booked_at: booking.booked_at,
  });

  return existingBooking;
};


// DELETE BOOKING


export const deleteBooking = async (id: number) => {
  const booking = await Booking.findByPk(id);

  if (!booking) {
    return null;
  }

  await booking.destroy();

  return booking;
};

// CREATE BOOKING WITH SEAT

export const createBookingWithSeat = async (
  booking: any,
  showSeatId: number
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Check and lock the show seat
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

    // 2. Cannot book an already booked seat
    if (showSeat.status === "booked") {
      throw new Error("Seat is already booked");
    }

    // 3. Cannot book an actively locked seat
    if (
      showSeat.status === "locked" &&
      showSeat.locked_until &&
      new Date(showSeat.locked_until) > new Date()
    ) {
      throw new Error("Seat is currently locked");
    }

    // 4. Create booking
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

    // 5. Connect booking with show seat
    await client.query(
      `INSERT INTO booking_seat
       (booking_id, show_seat_id)
       VALUES ($1, $2)`,
      [newBooking.id, showSeatId]
    );

    // 6. Mark seat as booked
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

// CONFIRM BOOKING

export const confirmBooking = async (
  bookingReference: string
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Find and lock booking
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

    // 2. Booking must be pending
    if (booking.booking_status !== "PENDING") {
      throw new Error("Booking is not pending");
    }

    // 3. Find and lock associated show seat
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

    // 4. Check lock expiry
    if (
      showSeat.status !== "locked" ||
      !showSeat.locked_until ||
      new Date(showSeat.locked_until) <= new Date()
    ) {
      throw new Error("Seat lock has expired");
    }

    // 5. Confirm booking
    const updatedBookingResult = await client.query(
      `UPDATE booking
       SET booking_status = 'CONFIRMED'
       WHERE id = $1
       RETURNING *`,
      [booking.id]
    );

    // 6. Mark seat as booked
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