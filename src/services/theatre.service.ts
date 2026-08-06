import { pool } from "../config/database";

export const createTheatre = async (theatre: any) => {
  const { name, address, city, state, contact_number } = theatre;

  const result = await pool.query(
    `INSERT INTO theatre
    (name,address,city,state,contact_number)
    VALUES($1,$2,$3,$4,$5)
    RETURNING *`,
    [name, address, city, state, contact_number]
  );

  return result.rows[0];
};

export const getAllTheatres = async () => {
  const result = await pool.query(
    "SELECT * FROM theatre ORDER BY id"
  );

  return result.rows;
};

export const getTheatreById = async (id: number) => {
  const result = await pool.query(
    "SELECT * FROM theatre WHERE id=$1",
    [id]
  );

  return result.rows[0];
};

export const updateTheatre = async (id: number, theatre: any) => {
  const { name, address, city, state, contact_number } = theatre;

  const result = await pool.query(
    `UPDATE theatre
     SET
     name=$1,
     address=$2,
     city=$3,
     state=$4,
     contact_number=$5
     WHERE id=$6
     RETURNING *`,
    [name, address, city, state, contact_number, id]
  );

  return result.rows[0];
};

export const deleteTheatre = async (id: number) => {
  const result = await pool.query(
    "DELETE FROM theatre WHERE id=$1 RETURNING *",
    [id]
  );

  return result.rows[0];
};