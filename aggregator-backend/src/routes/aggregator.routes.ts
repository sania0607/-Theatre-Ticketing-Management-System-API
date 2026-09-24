import { Router } from "express";

import {
  getMoviesFromTheatre,
  getShowsFromTheatre,
  getShowSeatsFromTheatre,
  lockSeatAtTheatre,
  releaseSeatAtTheatre,
  getBookingStatusFromTheatre,
  cancelBookingAtTheatre,
} from "../services/theatreApi.service";
import { createCheckoutSession, refundBookingPayment } from "../services/stripe.service";

const router = Router();

router.get("/movies", async (_req, res) => {
  try {
    const movies = await getMoviesFromTheatre();
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch movies",
    });
  }
});


router.get("/shows", async (req, res) => {
  try {
    const movieId = req.query.movie_id
      ? Number(req.query.movie_id)
      : undefined;

    const shows = await getShowsFromTheatre(movieId);
    res.json(shows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch shows",
    });
  }
});


router.get("/show-seats", async (req, res) => {
  try {
    const showId = Number(req.query.show_id);

    if (!showId) {
      return res.status(400).json({
        message: "show_id is required",
      });
    }

    const showSeats =
      await getShowSeatsFromTheatre(showId);

    res.json(showSeats);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch show seats",
    });
  }
});

router.post("/show-seats/:id/lock", async (req, res) => {
  try {
    const result = await lockSeatAtTheatre(
      Array.isArray(req.body.showSeatIds)
        ? req.body.showSeatIds.map(Number)
        : Number(req.params.id),
      req.body.aggregatorName,
      Number(req.body.totalAmount)
    );

    let checkoutSession;

    try {
      checkoutSession = await createCheckoutSession(
        result.bookingReference,
        Number(req.body.totalAmount)
      );
    } catch (error) {
      await releaseSeatAtTheatre(
        Array.isArray(req.body.showSeatIds)
          ? req.body.showSeatIds.map(Number)
          : Number(req.params.id)
      );
      throw error;
    }

    res.json({
      ...result,
      checkoutUrl: checkoutSession.url,
    });
  } catch (error) {
    console.error("LOCK SEAT CHECKOUT ERROR:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to lock seat",
    });
  }
});

router.get("/bookings/:bookingReference/status", async (req, res) => {
  try {
    const booking = await getBookingStatusFromTheatre(
      req.params.bookingReference
    );

    res.json(booking);
  } catch (error) {
    console.error("GET BOOKING STATUS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch booking status",
    });
  }
});

router.post("/bookings/:bookingReference/cancel", async (req, res) => {
  try {
    const bookingReference = req.params.bookingReference;
    const booking = await getBookingStatusFromTheatre(bookingReference);

    if (booking.booking_status === "CONFIRMED") {
      await refundBookingPayment(bookingReference);
    }

    const result = await cancelBookingAtTheatre(bookingReference);
    res.json(result);
  } catch (error) {
    console.error("CANCEL BOOKING ERROR:", error);
    res.status(409).json({
      message: error instanceof Error ? error.message : "Failed to cancel booking",
    });
  }
});


export default router;