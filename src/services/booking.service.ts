import { sequelize } from "../config/sequelize";
import { Op } from "sequelize";
import Booking from "../models/booking.model";
import BookingSeat from "../models/bookingseat.model";
import ShowSeat from "../models/showseat.model";
import Seat from "../models/seat.model";

// CREATE BOOKING

export const createBooking = async (booking: any) => {
  const {
    show_id,
    aggregator_name,
    booking_reference,
    booking_status,
    total_amount,
    booked_at,
  } = booking;

  const newBooking = await Booking.create({
    show_id,
    aggregator_name,
    booking_reference,
    booking_status,
    total_amount,
    booked_at,
  });

  return newBooking;
};

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

export const getBookingByReference = async (bookingReference: string) => {
  return Booking.findOne({
    where: {
      booking_reference: bookingReference,
    },
  });
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


// CREATE BOOKING WITH SEAT
// Creates a PENDING booking for an already LOCKED seat.
// The seat remains LOCKED until confirmation.

export const createBookingWithSeat = async (
  booking: any,
  showSeatId: number
) => {
  return await sequelize.transaction(async (transaction) => {
    // 1. Find and lock the ShowSeat row

    const showSeat = await ShowSeat.findByPk(showSeatId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!showSeat) {
      throw new Error("Show seat not found");
    }

    // 2. Seat must be LOCKED

    if (showSeat.status !== "LOCKED") {
      if (showSeat.status === "BOOKED") {
        throw new Error("Seat is already booked");
      }

      throw new Error("Seat is not locked");
    }

    // 3. Check whether the lock has expired

    if (
      !showSeat.locked_until ||
      new Date(showSeat.locked_until) <= new Date()
    ) {
      throw new Error("Seat lock has expired");
    }

    // 4. Create PENDING booking

    const newBooking = await Booking.create(
      {
        show_id: booking.show_id,
        aggregator_name: booking.aggregator_name,
        booking_reference: booking.booking_reference,
        booking_status: "PENDING",
        total_amount: booking.total_amount,
        booked_at: booking.booked_at || new Date(),
      },
      {
        transaction,
      }
    );

    // 5. Connect booking with ShowSeat

    await BookingSeat.create(
      {
        booking_id: newBooking.id,
        show_seat_id: showSeatId,
      },
      {
        transaction,
      }
    );

    // Seat stays LOCKED.
    // It becomes BOOKED only after confirmation.

    return newBooking;
  });
};


// CONFIRM BOOKING
// PENDING booking → CONFIRMED
// LOCKED seats → BOOKED

export const confirmBooking = async (
  bookingReference: string
) => {
  return await sequelize.transaction(async (transaction) => {
    // 1. Find and lock the booking

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

    if (booking.booking_status !== "PENDING") {
      throw new Error("Booking is not pending");
    }

    // 3. Find seats connected to this booking

    const bookingSeats = await BookingSeat.findAll({
      where: {
        booking_id: booking.id,
      },
      transaction,
    });

    if (bookingSeats.length === 0) {
      throw new Error("Show seat not found");
    }

    // 4. Extract ShowSeat IDs

    const showSeatIds = bookingSeats.map(
      (bookingSeat) => bookingSeat.show_seat_id
    );

    // 5. Find and lock all ShowSeat rows

    const showSeats = await ShowSeat.findAll({
      where: {
        id: {
          [Op.in]: showSeatIds,
        },
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (showSeats.length !== bookingSeats.length) {
      throw new Error("Show seat not found");
    }

    // 6. Validate every seat

    for (const showSeat of showSeats) {
      // Seat must still be LOCKED

      if (showSeat.status !== "LOCKED") {
        if (showSeat.status === "BOOKED") {
          throw new Error("Seat is already booked");
        }

        throw new Error("Seat is not locked");
      }

      // Lock must not have expired

      if (
        !showSeat.locked_until ||
        new Date(showSeat.locked_until) <= new Date()
      ) {
        throw new Error("Seat lock has expired");
      }
    }

    // 7. Confirm the booking

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

    const updatedShowSeats = await ShowSeat.findAll({
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
  });
};

export const setBookingCheckoutSession = async (
  bookingReference: string,
  checkoutSessionId: string
) => {
  const booking = await Booking.findOne({
    where: {
      booking_reference: bookingReference,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.booking_status !== "PENDING") {
    throw new Error("Booking is not pending");
  }

  await booking.update({
    stripe_checkout_session_id: checkoutSessionId,
  });

  return booking;
};

export const cancelBooking = async (bookingReference: string) => {
  return sequelize.transaction(async (transaction) => {
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

    if (booking.booking_status === "CANCELLED") {
      return booking;
    }

    if (booking.booking_status === "CANCELLATION_PENDING") {
      return booking;
    }

    if (!["PENDING", "CONFIRMED"].includes(booking.booking_status || "")) {
      throw new Error("Booking cannot be cancelled");
    }

    await booking.update(
      {
        booking_status: "CANCELLATION_PENDING",
      },
      { transaction }
    );

    return booking;
  });
};

export const completeBookingCancellation = async (
  bookingReference: string
) => {
  return sequelize.transaction(async (transaction) => {
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

    if (booking.booking_status === "CANCELLED") {
      return booking;
    }

    if (booking.booking_status !== "CANCELLATION_PENDING") {
      throw new Error("Booking cancellation has not been prepared");
    }

    const bookingSeats = await BookingSeat.findAll({
      where: {
        booking_id: booking.id,
      },
      transaction,
    });

    const showSeatIds = bookingSeats.map(
      (bookingSeat) => bookingSeat.show_seat_id
    );
    const showSeats = await ShowSeat.findAll({
      where: {
        id: {
          [Op.in]: showSeatIds,
        },
      },
      order: [["id", "ASC"]],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    const showSeatsById = new Map(
      showSeats.map((showSeat) => [showSeat.id, showSeat])
    );
    const otherActiveBookings = await BookingSeat.findAll({
      where: {
        show_seat_id: {
          [Op.in]: showSeatIds,
        },
        booking_id: {
          [Op.ne]: booking.id,
        },
      },
      include: [
        {
          model: Booking,
          as: "booking",
          attributes: ["id", "booking_status"],
          where: {
            booking_status: {
              [Op.in]: ["PENDING", "CONFIRMED", "CANCELLATION_PENDING"],
            },
          },
        },
      ],
      transaction,
    });
    const protectedSeatIds = new Set<number>();
    const currentTime = new Date();

    for (const otherBookingSeat of otherActiveBookings) {
      const relatedBooking = (otherBookingSeat as BookingSeat & {
        booking?: Booking;
      }).booking;
      const showSeat = showSeatsById.get(otherBookingSeat.show_seat_id);

      if (
        !relatedBooking ||
        !showSeat ||
        (relatedBooking.booking_status === "CONFIRMED" &&
          showSeat.status === "BOOKED") ||
        (relatedBooking.booking_status === "PENDING" &&
          showSeat.status === "LOCKED" &&
          showSeat.locked_until &&
          new Date(showSeat.locked_until) > currentTime) ||
        (relatedBooking.booking_status === "CANCELLATION_PENDING" &&
          ((showSeat.status === "BOOKED") ||
            (showSeat.status === "LOCKED" &&
              showSeat.locked_until &&
              new Date(showSeat.locked_until) > currentTime)))
      ) {
        protectedSeatIds.add(otherBookingSeat.show_seat_id);
      }
    }

    const releasableSeatIds = showSeatIds.filter(
      (showSeatId) => !protectedSeatIds.has(showSeatId)
    );

    if (releasableSeatIds.length > 0) {
      await ShowSeat.update(
        {
          status: "AVAILABLE",
          locked_until: null,
        },
        {
          where: {
            id: {
              [Op.in]: releasableSeatIds,
            },
          },
          transaction,
        }
      );
    }

    await booking.update(
      {
        booking_status: "CANCELLED",
      },
      { transaction }
    );

    return booking;
  });
};