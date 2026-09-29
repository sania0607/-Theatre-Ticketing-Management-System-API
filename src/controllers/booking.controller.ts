import { Request, Response } from "express";
import * as bookingService from "../services/booking.service";
import { Authenticate, Authorize } from "../decorators/auth.decorator";

export class BookingController {

@Authenticate()
@Authorize("create:booking")
async createBooking(req: Request, res: Response) {
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

@Authenticate()
@Authorize("read:booking")
async getAllBookings(_req: Request, res: Response) {
  try {
    const bookings = await bookingService.getAllBookings();

    res.json(bookings);
  } catch (error) {
    console.error("GET BOOKINGS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};

@Authenticate()
@Authorize("read:booking")
async getBookingById(req: Request, res: Response) {
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
    console.error("GET BOOKING ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch booking",
    });
  }
};

@Authenticate()
async getBookingByReference(req: Request, res: Response) {
  try {
    const booking = await bookingService.getBookingByReference(
      String(req.params.bookingReference)
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json(booking);
  } catch (error) {
    console.error("GET BOOKING STATUS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch booking status",
    });
  }
};

@Authenticate()
@Authorize("create:booking")
async setCheckoutSession(req: Request, res: Response) {
  try {
    const checkoutSessionId = req.body.checkoutSessionId;

    if (typeof checkoutSessionId !== "string" || !checkoutSessionId.startsWith("cs_")) {
      return res.status(400).json({
        message: "Valid Stripe Checkout Session ID is required",
      });
    }

    const booking = await bookingService.setBookingCheckoutSession(
      String(req.params.bookingReference),
      checkoutSessionId
    );

    res.json(booking);
  } catch (error: any) {
    console.error("SAVE CHECKOUT SESSION ERROR:", error);
    res.status(error.message === "Booking not found" ? 404 : 409).json({
      message: error.message || "Failed to save Checkout Session",
    });
  }
};

@Authenticate()
async updateBooking(req: Request, res: Response) {
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
    console.error("UPDATE BOOKING ERROR:", error);

    res.status(500).json({
      message: "Failed to update booking",
    });
  }
};

@Authenticate()
async deleteBooking(req: Request, res: Response) {
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
    console.error("DELETE BOOKING ERROR:", error);

    res.status(500).json({
      message: "Failed to delete booking",
    });
  }
};

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
    console.error("CONFIRM BOOKING ERROR:", error);

    if (error.message === "Booking not found") {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (error.message === "Booking is not pending") {
      return res.status(409).json({
        message: "Booking is not pending",
      });
    }

    if (error.message === "Show seat not found") {
      return res.status(404).json({
        message: "Show seat not found",
      });
    }

    if (error.message === "Seat lock has expired") {
      return res.status(409).json({
        message: "Seat lock has expired",
      });
    }

    res.status(500).json({
      message: "Failed to confirm booking",
      });
    }
  }

@Authenticate()
@Authorize("confirm:booking")
async cancelBooking(req: Request, res: Response) {
  try {
    const booking = await bookingService.cancelBooking(
      String(req.params.bookingReference)
    );

    res.json({
      message: "Booking cancellation started",
      booking,
    });
  } catch (error: any) {
    console.error("CANCEL BOOKING ERROR:", error);

    if (error.message === "Booking not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(409).json({ message: error.message });
  }
}

@Authenticate()
@Authorize("confirm:booking")
async completeBookingCancellation(req: Request, res: Response) {
  try {
    const booking = await bookingService.completeBookingCancellation(
      String(req.params.bookingReference)
    );

    res.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error: any) {
    console.error("COMPLETE BOOKING CANCELLATION ERROR:", error);
    res.status(error.message === "Booking not found" ? 404 : 409).json({
      message: error.message || "Failed to complete booking cancellation",
    });
  }
}
}