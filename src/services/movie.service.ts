import { pool } from "../config/database";

export const createMovie = async (movie: any) => {
  const { title, genre, language, duration, release_date } = movie;

  const result = await pool.query(
    `INSERT INTO movie
    (title, genre, language, duration, release_date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [title, genre, language, duration, release_date]
  );

  return result.rows[0];
};

export const getAllMovies = async () => {
  const result = await pool.query(
    "SELECT * FROM movie ORDER BY id"
  );

  return result.rows;
};

export const getMovieById = async (id: number) => {
  const result = await pool.query(
    "SELECT * FROM movie WHERE id = $1",
    [id]
  );

  return result.rows[0];
};

export const updateMovie = async (id: number, movie: any) => {
  const { title, genre, language, duration, release_date } = movie;

  const result = await pool.query(
    `UPDATE movie
     SET title = $1,
         genre = $2,
         language = $3,
         duration = $4,
         release_date = $5
     WHERE id = $6
     RETURNING *`,
    [title, genre, language, duration, release_date, id]
  );

  return result.rows[0];
};

export const deleteMovie = async (id: number) => {
  const result = await pool.query(
    "DELETE FROM movie WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0];
};