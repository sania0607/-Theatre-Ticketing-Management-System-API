import { pool } from "../config/database";

export const createScreen = async (screen: any) => {
  const { theatre_id, name, capacity } = screen;

  const result = await pool.query(
    `INSERT INTO screen (theatre_id, name, capacity)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [theatre_id, name, capacity]
  );

  return result.rows[0];
};

export const getAllScreens = async () => {
  const result = await pool.query(
    "SELECT * FROM screen ORDER BY id"
  );

  return result.rows;
};

export const getScreenById = async (id: number) => {
  const result = await pool.query(
    "SELECT * FROM screen WHERE id=$1",
    [id]
  );

  return result.rows[0];
};

export const updateScreen = async (id: number, screen: any) => {
  const { theatre_id, name, capacity } = screen;

  const result = await pool.query(
    `UPDATE screen
     SET theatre_id=$1,
         name=$2,
         capacity=$3
     WHERE id=$4
     RETURNING *`,
    [theatre_id, name, capacity, id]
  );

  return result.rows[0];
};

export const deleteScreen = async (id: number) => {
  const result = await pool.query(
    "DELETE FROM screen WHERE id=$1 RETURNING *",
    [id]
  );

  return result.rows[0];
};