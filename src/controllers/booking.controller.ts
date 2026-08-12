import { Request, Response } from "express";
import * as bookingService from "../services/booking.service";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.createBooking(req.body);

    res.status(201).json(booking);
  } catch (error) {
    console.error("CREATE BOOKING ERROR:", error);

    res.status(500).json({
      message: "Failed to create booking",
    });
  }
};

export const getAllBookings = async (_req: Request, res: Response) => {
  try {
    const bookings = await bookingService.getAllBookings();

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.getBookingById(
      Number(req.params.id)
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch booking",
    });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.updateBooking(
      Number(req.params.id),
      req.body
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update booking",
    });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.deleteBooking(
      Number(req.params.id)
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete booking",
    });
  }
};
export const createBookingWithSeat = async (
  req: Request,
  res: Response
) => {
  try {
    const { show_seat_id, ...booking } = req.body;

    const newBooking =
      await bookingService.createBookingWithSeat(
        booking,
        Number(show_seat_id)
      );

    res.status(201).json(newBooking);
  } catch (error: any) {
    console.error("CREATE BOOKING WITH SEAT ERROR:", error);

    if (error.message === "Show seat not found") {
      return res.status(404).json({
        message: "Show seat not found",
      });
    }

    if (error.message === "Seat is already booked") {
      return res.status(409).json({
        message: "Seat is already booked",
      });
    }

    if (error.message === "Seat is currently locked") {
      return res.status(409).json({
        message: "Seat is currently locked",
      });
    }

    res.status(500).json({
      message: "Failed to create booking",
    });
  }
};