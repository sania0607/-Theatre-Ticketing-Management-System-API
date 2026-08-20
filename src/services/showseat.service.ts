import { sequelize } from "../config/sequelize";

import ShowSeat from "../models/showseat.model";
import Booking from "../models/booking.model";
import BookingSeat from "../models/bookingseat.model";

// CREATE SHOW SEAT

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
    status: status || "AVAILABLE",
    locked_until,
  });

  return newShowSeat;
};

// GET ALL SHOW SEATS

export const getAllShowSeats = async () => {
  const showSeats = await ShowSeat.findAll({
    order: [["id", "ASC"]],
  });

  return showSeats;
};

// GET SHOW SEAT BY ID

export const getShowSeatById = async (id: number) => {
  const showSeat = await ShowSeat.findByPk(id);

  return showSeat;
};

// UPDATE SHOW SEAT

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

// DELETE SHOW SEAT

export const deleteShowSeat = async (id: number) => {
  const showSeat = await ShowSeat.findByPk(id);

  if (!showSeat) {
    return null;
  }

  await showSeat.destroy();

  return showSeat;
};

// LOCK SHOW SEAT + CREATE PENDING BOOKING

export const lockShowSeat = async (
  showSeatId: number,
  aggregatorName: string,
  totalAmount: number
) => {
  return await sequelize.transaction(async (transaction) => {

    // 1. Find and lock the ShowSeat row

    const showSeat = await ShowSeat.findByPk(
      showSeatId,
      {
        transaction,
        lock: transaction.LOCK.UPDATE,
      }
    );

    if (!showSeat) {
      throw new Error("Show seat not found");
    }

    // 2. Check if seat is already booked

    if (showSeat.status === "BOOKED") {
      throw new Error("Seat is already booked");
    }

    // 3. Check if seat is currently locked

    if (
      showSeat.status === "LOCKED" &&
      showSeat.locked_until &&
      new Date(showSeat.locked_until) > new Date()
    ) {
      throw new Error("Seat is already locked");
    }

    // 4. If previous lock expired,
    //    allow the seat to be locked again.

    const lockDuration = 5 * 60 * 1000; // 5 minutes

    const lockedUntil = new Date(
      Date.now() + lockDuration
    );

    // 5. Lock the seat

    await showSeat.update(
      {
        status: "LOCKED",
        locked_until: lockedUntil,
      },
      {
        transaction,
      }
    );

    // 6. Generate booking reference

    const bookingReference =
      `BK-${Date.now()}-${Math.floor(
        Math.random() * 10000
      )}`;

    // 7. Create PENDING booking

    const booking = await Booking.create(
      {
        show_id: showSeat.show_id,
        aggregator_name: aggregatorName,
        booking_reference: bookingReference,
        booking_status: "PENDING",
        total_amount: totalAmount,
        booked_at: new Date(),
      },
      {
        transaction,
      }
    );

    // 8. Connect booking with ShowSeat

    await BookingSeat.create(
      {
        booking_id: booking.id,
        show_seat_id: showSeat.id,
      },
      {
        transaction,
      }
    );

    // 9. Return both

    return {
      booking,
      showSeat,
    };
  });
};