import { pool } from "../config/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createStaff = async (
  username: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO staff (username, password)
     VALUES ($1, $2)
     RETURNING id, username`,
    [username, hashedPassword]
  );

  return result.rows[0];
};

export const loginStaff = async (
  username: string,
  password: string
) => {
  const result = await pool.query(
    `SELECT * FROM staff WHERE username = $1`,
    [username]
  );

  const staff = result.rows[0];

  if (!staff) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    staff.password
  );

  if (!isPasswordValid) {
    return null;
  }

  const token = jwt.sign(
    {
      id: staff.id,
      username: staff.username,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h",
    }
  );

  return {
    id: staff.id,
    username: staff.username,
    accessToken: token,
  };
};