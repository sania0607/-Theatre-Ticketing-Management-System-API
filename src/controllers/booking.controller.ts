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