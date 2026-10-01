import { sequelize } from "../config/sequelize";
import { Op } from "sequelize";

import ShowSeat from "../models/showseat.model";
import Show from "../models/show.model";
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

// GET SHOW SEATS BY SHOW ID

export const getShowSeatsByShowId = async (showId: number) => {
  await ShowSeat.update(
    {
      status: "AVAILABLE",
      locked_until: null,
    },
    {
      where: {
        show_id: showId,
        status: "LOCKED",
        locked_until: {
          [Op.lte]: new Date(),
        },
      },
    }
  );

  const showSeats = await ShowSeat.findAll({
    where: {
      show_id: showId,
    },
    order: [["seat_id", "ASC"]],
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

// LOCK SHOW SEAT 

export const lockShowSeat = async (
  showSeatId: number,
  aggregatorName: string
) => {
  const result = await lockShowSeats(
    [showSeatId],
    aggregatorName
  );

  return {
    booking: result.booking,
    showSeat: result.showSeats[0],
  };
};

export const lockShowSeats = async (
  showSeatIds: number[],
  aggregatorName: string
) => {
  return await sequelize.transaction(async (transaction) => {
    const showSeats = [];
    const orderedShowSeatIds = [...new Set(showSeatIds)].sort(
      (firstId, secondId) => firstId - secondId
    );

    for (const showSeatId of orderedShowSeatIds) {
      const showSeat = await ShowSeat.findByPk(showSeatId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!showSeat) {
        throw new Error("Show seat not found");
      }

      if (showSeats.length > 0 && showSeat.show_id !== showSeats[0].show_id) {
        throw new Error("Seats must belong to the same show");
      }

      if (showSeat.status === "BOOKED") {
        throw new Error("Seat is already booked");
      }

      if (
        showSeat.status === "LOCKED" &&
        showSeat.locked_until &&
        new Date(showSeat.locked_until) > new Date()
      ) {
        throw new Error("Seat is already locked");
      }

      const lockedUntil = new Date(Date.now() + 5 * 60 * 1000);

      await showSeat.update(
        {
          status: "LOCKED",
          locked_until: lockedUntil,
        },
        { transaction }
      );

      showSeats.push(showSeat);
    }

    if (showSeats.length === 0) {
      throw new Error("At least one seat is required");
    }

    const show = await Show.findByPk(showSeats[0].show_id, { transaction });
    const ticketPrice = Number(show?.ticket_price);

    if (!show || !Number.isFinite(ticketPrice) || ticketPrice <= 0) {
      throw new Error("Show ticket price must be greater than zero");
    }

    const totalAmount = Math.round(ticketPrice * 100 * showSeats.length) / 100;

    const booking = await Booking.create(
      {
        show_id: showSeats[0].show_id,
        aggregator_name: aggregatorName,
        booking_reference: `BK-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        booking_status: "PENDING",
        total_amount: totalAmount,
        booked_at: new Date(),
      },
      {
        transaction,
      }
    );

    await BookingSeat.bulkCreate(
      showSeats.map((showSeat) => ({
        booking_id: booking.id,
        show_seat_id: showSeat.id,
      })),
      { transaction }
    );

    return {
      booking,
      showSeats,
      totalAmount,
    };
  });
};

export const releaseShowSeat = async (showSeatId: number) => {
  const showSeat = await ShowSeat.findByPk(showSeatId);

  if (!showSeat) {
    throw new Error("Show seat not found");
  }

  if (showSeat.status === "LOCKED") {
    await showSeat.update({
      status: "AVAILABLE",
      locked_until: null,
    });
  }

  return showSeat;
};
