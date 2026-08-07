import { pool } from "../config/database";

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