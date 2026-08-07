import { pool } from "../config/database";

export const createShow = async (show: any) => {
  const {
    movie_id,
    screen_id,
    show_date,
    start_time,
    end_time,
    ticket_price,
  } = show;

  const result = await pool.query(
    `INSERT INTO "show"
    (movie_id, screen_id, show_date, start_time, end_time, ticket_price)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      movie_id,
      screen_id,
      show_date,
      start_time,
      end_time,
      ticket_price,
    ]
  );

  return result.rows[0];
};

export const getAllShows = async () => {
  const result = await pool.query(
    `SELECT * FROM "show" ORDER BY id`
  );

  return result.rows;
};

export const getShowById = async (id: number) => {
  const result = await pool.query(
    `SELECT * FROM "show" WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};

export const updateShow = async (id: number, show: any) => {
  const {
    movie_id,
    screen_id,
    show_date,
    start_time,
    end_time,
    ticket_price,
  } = show;

  const result = await pool.query(
    `UPDATE "show"
     SET movie_id = $1,
         screen_id = $2,
         show_date = $3,
         start_time = $4,
         end_time = $5,
         ticket_price = $6
     WHERE id = $7
     RETURNING *`,
    [
      movie_id,
      screen_id,
      show_date,
      start_time,
      end_time,
      ticket_price,
      id,
    ]
  );

  return result.rows[0];
};

export const deleteShow = async (id: number) => {
  const result = await pool.query(
    `DELETE FROM "show"
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
};