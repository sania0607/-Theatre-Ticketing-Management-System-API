import Seat from "../models/seat.model";

export const createSeat = async (seat: any) => {
  const {
    screen_id,
    seat_number,
    row_name,
  } = seat;

  const newSeat = await Seat.create({
    screen_id,
    seat_number,
    row_name,
  });

  return newSeat;
};

export const getAllSeats = async () => {
  const seats = await Seat.findAll({
    order: [["id", "ASC"]],
  });

  return seats;
};

export const getSeatById = async (id: number) => {
  const seat = await Seat.findByPk(id);

  return seat;
};

export const updateSeat = async (
  id: number,
  seat: any
) => {
  const {
    screen_id,
    seat_number,
    row_name,
  } = seat;

  const existingSeat = await Seat.findByPk(id);

  if (!existingSeat) {
    return null;
  }

  await existingSeat.update({
    screen_id,
    seat_number,
    row_name,
  });

  return existingSeat;
};

export const deleteSeat = async (id: number) => {
  const seat = await Seat.findByPk(id);

  if (!seat) {
    return null;
  }

  await seat.destroy();

  return seat;
};