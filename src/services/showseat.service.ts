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
export const lockShowSeat = async (id: number) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Lock the row so two requests cannot lock the same seat simultaneously
    const result = await client.query(
      `SELECT * FROM show_seat
       WHERE id = $1
       FOR UPDATE`,
      [id]
    );

    const showSeat = result.rows[0];

    if (!showSeat) {
      throw new Error("Show seat not found");
    }

    // If already booked, it cannot be locked
    if (showSeat.status === "booked") {
      throw new Error("Seat is already booked");
    }

    // If currently locked, check whether the lock has expired
    if (
      showSeat.status === "locked" &&
      showSeat.locked_until &&
      new Date(showSeat.locked_until) > new Date()
    ) {
      throw new Error("Seat is already locked");
    }

    // Lock for 10 minutes
    const lockedUntil = new Date(Date.now() + 10 * 60 * 1000);

    const updated = await client.query(
      `UPDATE show_seat
       SET status = 'locked',
           locked_until = $1
       WHERE id = $2
       RETURNING *`,
      [lockedUntil, id]
    );

    await client.query("COMMIT");

    return updated.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};