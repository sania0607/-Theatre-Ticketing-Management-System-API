import { pool } from "../config/database";

export const createBookingSeat = async (bookingSeat: any) => {
  const { booking_id, show_seat_id } = bookingSeat;

  const result = await pool.query(
    `INSERT INTO booking_seat
    (booking_id, show_seat_id)
    VALUES ($1, $2)
    RETURNING *`,
    [booking_id, show_seat_id]
  );

  return result.rows[0];
};

export const getAllBookingSeats = async () => {
  const result = await pool.query(
    "SELECT * FROM booking_seat ORDER BY id"
  );

  return result.rows;
};

export const getBookingSeatById = async (id: number) => {
  const result = await pool.query(
    "SELECT * FROM booking_seat WHERE id = $1",
    [id]
  );

  return result.rows[0];
};

export const updateBookingSeat = async (
  id: number,
  bookingSeat: any
) => {
  const { booking_id, show_seat_id } = bookingSeat;

  const result = await pool.query(
    `UPDATE booking_seat
     SET booking_id = $1,
         show_seat_id = $2
     WHERE id = $3
     RETURNING *`,
    [booking_id, show_seat_id, id]
  );

  return result.rows[0];
};

export const deleteBookingSeat = async (id: number) => {
  const result = await pool.query(
    "DELETE FROM booking_seat WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0];
};