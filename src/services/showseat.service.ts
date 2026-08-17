import ShowSeat from "../models/showseat.model";

export const createShowSeat = async (showSeat: any) => {
  const {
    show_id,
    seat_id,
    status,
    locked_until,
  } = showSeat;

  const newShowSeat = await ShowSeat.create({
    show_id,
    seat_id,
    status,
    locked_until,
  });

  return newShowSeat;
};

export const getAllShowSeats = async () => {
  const showSeats = await ShowSeat.findAll({
    order: [["id", "ASC"]],
  });

  return showSeats;
};

export const getShowSeatById = async (id: number) => {
  const showSeat = await ShowSeat.findByPk(id);

  return showSeat;
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

  const existingShowSeat =
    await ShowSeat.findByPk(id);

  if (!existingShowSeat) {
    return null;
  }

  await existingShowSeat.update({
    show_id,
    seat_id,
    status,
    locked_until,
  });

  return existingShowSeat;
};

export const deleteShowSeat = async (id: number) => {
  const showSeat = await ShowSeat.findByPk(id);

  if (!showSeat) {
    return null;
  }

  await showSeat.destroy();

  return showSeat;
};