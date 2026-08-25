import { Request, Response } from "express";
import * as bookingSeatService from "../services/bookingseat.service";
import { Authenticate } from "../decorators/auth.decorator";

export class BookingSeatController {

@Authenticate()
async createBookingSeat(req: Request, res: Response) {
  try {
    const bookingSeat =
      await bookingSeatService.createBookingSeat(req.body);

    res.status(201).json(bookingSeat);
  } catch (error) {
    console.error("CREATE BOOKING SEAT ERROR:", error);

    res.status(500).json({
      message: "Failed to create booking seat",
    });
  }
};

@Authenticate()
async getAllBookingSeats(_req: Request, res: Response) {
  try {
    const bookingSeats =
      await bookingSeatService.getAllBookingSeats();

    res.json(bookingSeats);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch booking seats",
    });
  }
};

@Authenticate()
async getBookingSeatById(req: Request, res: Response) {
  try {
    const bookingSeat =
      await bookingSeatService.getBookingSeatById(
        Number(req.params.id)
      );

    if (!bookingSeat) {
      return res.status(404).json({
        message: "Booking seat not found",
      });
    }

    res.json(bookingSeat);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch booking seat",
    });
  }
};

@Authenticate()
async updateBookingSeat(req: Request, res: Response) {
  try {
    const bookingSeat =
      await bookingSeatService.updateBookingSeat(
        Number(req.params.id),
        req.body
      );

    if (!bookingSeat) {
      return res.status(404).json({
        message: "Booking seat not found",
      });
    }

    res.json(bookingSeat);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update booking seat",
    });
  }
};

  @Authenticate()
  async deleteBookingSeat(req: Request, res: Response) {
  try {
    const bookingSeat =
      await bookingSeatService.deleteBookingSeat(
        Number(req.params.id)
      );

    if (!bookingSeat) {
      return res.status(404).json({
        message: "Booking seat not found",
      });
    }

    res.json({
      message: "Booking seat deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete booking seat",
      });
    }
  }
}