import BookingSeat from "../models/bookingseat.model";

export const createBookingSeat = async (
  bookingSeat: any
) => {
  const {
    booking_id,
    show_seat_id,
  } = bookingSeat;

  const newBookingSeat =
    await BookingSeat.create({
      booking_id,
      show_seat_id,
    });

  return newBookingSeat;
};

export const getAllBookingSeats = async () => {
  const bookingSeats =
    await BookingSeat.findAll({
      order: [["id", "ASC"]],
    });

  return bookingSeats;
};

export const getBookingSeatById = async (
  id: number
) => {
  const bookingSeat =
    await BookingSeat.findByPk(id);

  return bookingSeat;
};

export const updateBookingSeat = async (
  id: number,
  bookingSeat: any
) => {
  const {
    booking_id,
    show_seat_id,
  } = bookingSeat;

  const existingBookingSeat =
    await BookingSeat.findByPk(id);

  if (!existingBookingSeat) {
    return null;
  }

  await existingBookingSeat.update({
    booking_id,
    show_seat_id,
  });

  return existingBookingSeat;
};

export const deleteBookingSeat = async (
  id: number
) => {
  const bookingSeat =
    await BookingSeat.findByPk(id);

  if (!bookingSeat) {
    return null;
  }

  await bookingSeat.destroy();

  return bookingSeat;
};