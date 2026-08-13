import { pool } from "../config/database";
import crypto from "crypto";

export const createShowSeat = async (showSeat: any) => {
  const {
    show_id,
    seat_id,
    status,
    locked_until,
  } = showSeat;

  const result = await pool.query(
    `INSERT INTO show_seat
    (show_id, seat_id, status, locked_until)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
    [show_id, seat_id, status, locked_until]
  );

  return result.rows[0];
};

export const getAllShowSeats = async () => {
  const result = await pool.query(
    `SELECT * FROM show_seat ORDER BY id`
  );

  return result.rows;
};

export const getShowSeatById = async (id: number) => {
  const result = await pool.query(
    `SELECT * FROM show_seat WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};

export const updateShowSeat = async (
  id: number,
  showSeat: any
) => {
  const {
    show_id,
    seat_id,
    status,
    locked_until,
  } = showSeat;

  const result = await pool.query(
    `UPDATE show_seat
     SET show_id = $1,
         seat_id = $2,
         status = $3,
         locked_until = $4
     WHERE id = $5
     RETURNING *`,
    [
      show_id,
      seat_id,
      status,
      locked_until,
      id,
    ]
  );

  return result.rows[0];
};

export const deleteShowSeat = async (id: number) => {
  const result = await pool.query(
    `DELETE FROM show_seat
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
};
export const lockShowSeat = async (id: number,aggregatorName: string,
  totalAmount: number) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Lock the show_seat row
    const result = await client.query(
      `SELECT *
       FROM show_seat
       WHERE id = $1
       FOR UPDATE`,
      [id]
    );

    const showSeat = result.rows[0];

    if (!showSeat) {
      throw new Error("Show seat not found");
    }

    // 2. Cannot lock a booked seat
    if (showSeat.status === "booked") {
      throw new Error("Seat is already booked");
    }

    // 3. Check existing lock
    if (
      showSeat.status === "locked" &&
      showSeat.locked_until &&
      new Date(showSeat.locked_until) > new Date()
    ) {
      throw new Error("Seat is already locked");
    }

    // 4. Generate booking reference
    const bookingReference = `BK-${crypto.randomUUID()}`;

    // 5. Lock for 10 minutes
    const lockedUntil = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // 6. Create PENDING booking
    const bookingResult = await client.query(
      `INSERT INTO booking
       (show_id, aggregator_name, booking_reference,
        booking_status, total_amount)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        showSeat.show_id,
        aggregatorName,
        bookingReference,
        "PENDING",
        totalAmount
      ]
    );

    const booking = bookingResult.rows[0];

    // 7. Connect booking with show seat
    await client.query(
      `INSERT INTO booking_seat
       (booking_id, show_seat_id)
       VALUES ($1, $2)`,
      [booking.id, id]
    );

    // 8. Mark seat as locked
    const updated = await client.query(
      `UPDATE show_seat
       SET status = 'locked',
           locked_until = $1
       WHERE id = $2
       RETURNING *`,
      [lockedUntil, id]
    );

    await client.query("COMMIT");

    return {
      showSeat: updated.rows[0],
      booking: booking
    };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};