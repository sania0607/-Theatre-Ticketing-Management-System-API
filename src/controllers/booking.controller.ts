import { Request, Response } from "express";
import * as bookingService from "../services/booking.service";
import { Authenticate, Authorize } from "../decorators/auth.decorator";

export class BookingController {

  // CREATE BOOKING WITH MULTIPLE SEATS

  @Authenticate()
  @Authorize("create:booking")
  async createBooking(req: Request, res: Response) {
    try {
      const {
        show_id,
        aggregator_name,
        total_amount,
        showSeatIds,
      } = req.body;

      if (
        !Array.isArray(showSeatIds) ||
        showSeatIds.length === 0
      ) {
        return res.status(400).json({
          message: "showSeatIds must contain at least one seat",
        });
      }

      const booking =
        await bookingService.createBookingWithSeats(
          {
            show_id,
            aggregator_name,
            total_amount,
          },
          showSeatIds
        );

      res.status(201).json({
        message: "Booking created successfully",
        booking,
      });

    } catch (error: any) {
      console.error("CREATE BOOKING ERROR:", error);

      if (
        error.message ===
        "One or more show seats not found"
      ) {
        return res.status(404).json({
          message: error.message,
        });
      }

      if (
        error.message ===
        "One or more seats are already booked"
      ) {
        return res.status(409).json({
          message: error.message,
        });
      }

      if (
        error.message ===
        "One or more seats are not locked"
      ) {
        return res.status(409).json({
          message: error.message,
        });
      }

      if (
        error.message ===
        "One or more seat locks have expired"
      ) {
        return res.status(409).json({
          message: error.message,
        });
      }

      res.status(500).json({
        message: "Failed to create booking",
      });
    }
  }


  // GET ALL BOOKINGS

  @Authenticate()
  @Authorize("read:booking")
  async getAllBookings(_req: Request, res: Response) {
    try {
      const bookings =
        await bookingService.getAllBookings();

      res.json(bookings);
    } catch (error) {
      console.error("GET BOOKINGS ERROR:", error);

      res.status(500).json({
        message: "Failed to fetch bookings",
      });
    }
  }


  // GET BOOKING BY ID

  @Authenticate()
  @Authorize("read:booking")
  async getBookingById(req: Request, res: Response) {
    try {
      const booking =
        await bookingService.getBookingById(
          Number(req.params.id)
        );

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found",
        });
      }

      res.json(booking);
    } catch (error) {
      console.error("GET BOOKING ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch booking",
    });
  }
};

  @Authenticate()
  @Authorize("update:booking")
  async updateBooking(req: Request, res: Response) {
    try {
      const booking =
        await bookingService.updateBooking(
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
      console.error("UPDATE BOOKING ERROR:", error);

      res.status(500).json({
        message: "Failed to update booking",
      });
    }
  }


  // DELETE BOOKING

  @Authenticate()
  async deleteBooking(req: Request, res: Response) {
    try {
      const booking =
        await bookingService.deleteBooking(
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
      console.error("DELETE BOOKING ERROR:", error);

      res.status(500).json({
        message: "Failed to delete booking",
      });
    }
  }


  // CONFIRM BOOKING

  @Authenticate()
  @Authorize("confirm:booking")
  async confirmBooking(req: Request, res: Response) {
    try {
      const bookingReference = String(
        req.params.bookingReference
      );

      const result =
        await bookingService.confirmBooking(
          bookingReference
        );

      res.json({
        message: "Booking confirmed successfully",
        booking: result.booking,
        showSeats: result.showSeats,
      });

    } catch (error: any) {
      console.error(
        "CONFIRM BOOKING ERROR:",
        error
      );

      if (error.message === "Booking not found") {
        return res.status(404).json({
          message: "Booking not found",
        });
      }

      if (
        error.message ===
        "Booking is not pending"
      ) {
        return res.status(409).json({
          message: "Booking is not pending",
        });
      }

      if (
        error.message ===
        "One or more show seats not found"
      ) {
        return res.status(404).json({
          message: error.message,
        });
      }

      if (
        error.message ===
        "One or more seats are already booked"
      ) {
        return res.status(409).json({
          message: error.message,
        });
      }

      if (
        error.message ===
        "One or more seats are not locked"
      ) {
        return res.status(409).json({
          message: error.message,
        });
      }

      if (
        error.message ===
        "One or more seat locks have expired"
      ) {
        return res.status(409).json({
          message: error.message,
        });
      }

    res.status(500).json({
      message: "Failed to confirm booking",
      });
    }
  }
}