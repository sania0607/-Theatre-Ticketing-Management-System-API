import { sequelize } from "../config/sequelize";
import { Op } from "sequelize";
import Booking from "../models/booking.model";
import BookingSeat from "../models/bookingseat.model";
import ShowSeat from "../models/showseat.model";
import Seat from "../models/seat.model";

// GET ALL BOOKINGS

export const getAllBookings = async () => {
  const bookings = await Booking.findAll({
    order: [["id", "ASC"]],
  });

  return bookings;
};

// GET BOOKING BY ID

export const getBookingById = async (id: number) => {
  const booking = await Booking.findByPk(id, {
    include: [
      {
        model: BookingSeat,
        as: "bookingSeats",
        include: [
          {
            model: ShowSeat,
            as: "showSeat",
            include: [
              {
                model: Seat,
                as: "seat",
              },
            ],
          },
        ],
      },
    ],
  });

  return booking;
};

// UPDATE BOOKING

export const updateBooking = async (
  id: number,
  booking: any
) => {
  const existingBooking = await Booking.findByPk(id);

  if (!existingBooking) {
    return null;
  }

  await existingBooking.update({
    show_id: booking.show_id,
    aggregator_name: booking.aggregator_name,
    booking_reference: booking.booking_reference,
    booking_status: booking.booking_status,
    total_amount: booking.total_amount,
    booked_at: booking.booked_at,
  });

  return existingBooking;
};

// DELETE BOOKING

export const deleteBooking = async (id: number) => {
  const booking = await Booking.findByPk(id);

  if (!booking) {
    return null;
  }

  await booking.destroy();

  return booking;
};


// CREATE BOOKING WITH MULTIPLE SEATS
// Locks all selected seats and creates one PENDING booking
// in ONE transaction.

export const createBookingWithSeats = async (
  booking: any,
  showSeatIds: number[]
) => {
  return await sequelize.transaction(async (transaction) => {

    // 1. Validate seat IDs

    if (!showSeatIds || showSeatIds.length === 0) {
      throw new Error("At least one show seat is required");
    }

    if (!booking.show_id) {
      throw new Error("Show ID is required");
    }

    // Remove duplicate seat IDs

    const uniqueShowSeatIds = [
      ...new Set(showSeatIds),
    ];

    // 2. Find and lock all requested ShowSeat rows

    const showSeats = await ShowSeat.findAll({
      where: {
        id: {
          [Op.in]: uniqueShowSeatIds,
        },
        show_id: booking.show_id,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    // 3. Make sure all requested seats exist

    if (
      showSeats.length !==
      uniqueShowSeatIds.length
    ) {
      throw new Error(
        "One or more show seats not found"
      );
    }

    // 4. Check every seat

    for (const showSeat of showSeats) {

      // Already booked

      if (showSeat.status === "BOOKED") {
        throw new Error(
          "One or more seats are already booked"
        );
      }

      // If currently locked, check whether lock expired

      if (showSeat.status === "LOCKED") {

        if (
          showSeat.locked_until &&
          new Date(showSeat.locked_until) > new Date()
        ) {
          throw new Error(
            "One or more seats are already locked"
          );
        }

        // Previous lock expired
        // We can lock it again
      }
    }

    // 5. Create lock time

    const lockDuration = 5 * 60 * 1000;

    const lockedUntil = new Date(
      Date.now() + lockDuration
    );

    // 6. Lock ALL selected seats

    await ShowSeat.update(
      {
        status: "LOCKED",
        locked_until: lockedUntil,
      },
      {
        where: {
          id: {
            [Op.in]: uniqueShowSeatIds,
          },
        },
        transaction,
      }
    );

    // 7. Generate ONE booking reference

    const bookingReference =
      `BK-${Date.now()}-${Math.floor(
        Math.random() * 10000
      )}`;

    // 8. Create ONE PENDING booking

    const newBooking = await Booking.create(
      {
        show_id: booking.show_id,
        aggregator_name: booking.aggregator_name,
        booking_reference: bookingReference,
        booking_status: "PENDING",
        total_amount: booking.total_amount,
        booked_at: booking.booked_at || new Date(),
      },
      {
        transaction,
      }
    );

    // 9. Create BookingSeat row for every seat

    for (const showSeatId of uniqueShowSeatIds) {

      await BookingSeat.create(
        {
          booking_id: newBooking.id,
          show_seat_id: showSeatId,
        },
        {
          transaction,
        }
      );
    }

    // 10. Return booking

    return newBooking;
  });
};


// CONFIRM BOOKING
// PENDING → CONFIRMED
// LOCKED seats → BOOKED

export const confirmBooking = async (
  bookingReference: string
) => {

  return await sequelize.transaction(
    async (transaction) => {

      // 1. Find and lock booking

      const booking = await Booking.findOne({
        where: {
          booking_reference: bookingReference,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!booking) {
        throw new Error("Booking not found");
      }

      // 2. Booking must be PENDING

      if (
        booking.booking_status !== "PENDING"
      ) {
        throw new Error(
          "Booking is not pending"
        );
      }

      // 3. Get all BookingSeat rows

      const bookingSeats =
        await BookingSeat.findAll({
          where: {
            booking_id: booking.id,
          },
          transaction,
        });

      if (bookingSeats.length === 0) {
        throw new Error(
          "Show seat not found"
        );
      }

      // 4. Get ShowSeat IDs

      const showSeatIds =
        bookingSeats.map(
          (bookingSeat) =>
            bookingSeat.show_seat_id
        );

      // 5. Lock all ShowSeat rows

      const showSeats =
        await ShowSeat.findAll({
          where: {
            id: {
              [Op.in]: showSeatIds,
            },
          },
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

      if (
        showSeats.length !==
        bookingSeats.length
      ) {
        throw new Error(
          "One or more show seats not found"
        );
      }

      // 6. Validate seats

      for (const showSeat of showSeats) {

        if (showSeat.status === "BOOKED") {
          throw new Error(
            "One or more seats are already booked"
          );
        }

        if (showSeat.status !== "LOCKED") {
          throw new Error(
            "One or more seats are not locked"
          );
        }

        if (
          !showSeat.locked_until ||
          new Date(showSeat.locked_until) <=
            new Date()
        ) {
          throw new Error(
            "One or more seat locks have expired"
          );
        }
      }

      // 7. Confirm booking

      await booking.update(
        {
          booking_status: "CONFIRMED",
        },
        {
          transaction,
        }
      );

      // 8. Mark all seats as BOOKED

      await ShowSeat.update(
        {
          status: "BOOKED",
          locked_until: null,
        },
        {
          where: {
            id: {
              [Op.in]: showSeatIds,
            },
          },
          transaction,
        }
      );

      // 9. Reload booking

      await booking.reload({
        transaction,
      });

      // 10. Get updated seats

      const updatedShowSeats =
        await ShowSeat.findAll({
          where: {
            id: {
              [Op.in]: showSeatIds,
            },
          },
          include: [
            {
              model: Seat,
              as: "seat",
            },
          ],
          transaction,
        });

      // 11. Return result

      return {
        booking,
        showSeats: updatedShowSeats,
      };
    }
  );
};