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