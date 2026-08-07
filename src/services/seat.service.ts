import { pool } from "../config/database";

export const createSeat = async (seat: any) => {
  const { screen_id, seat_number, row_name } = seat;

  const result = await pool.query(
    `INSERT INTO seat
    (screen_id, seat_number, row_name)
    VALUES ($1, $2, $3)
    RETURNING *`,
    [screen_id, seat_number, row_name]
  );

  return result.rows[0];
};

export const getAllSeats = async () => {
  const result = await pool.query(
    `SELECT * FROM seat ORDER BY id`
  );

  return result.rows;
};

export const getSeatById = async (id: number) => {
  const result = await pool.query(
    `SELECT * FROM seat WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};

export const updateSeat = async (id: number, seat: any) => {
  const { screen_id, seat_number, row_name } = seat;

  const result = await pool.query(
    `UPDATE seat
     SET screen_id = $1,
         seat_number = $2,
         row_name = $3
     WHERE id = $4
     RETURNING *`,
    [screen_id, seat_number, row_name, id]
  );

  return result.rows[0];
};

export const deleteSeat = async (id: number) => {
  const result = await pool.query(
    `DELETE FROM seat
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
};