import { Router } from "express";

import {
  getMoviesFromTheatre,
  getShowsFromTheatre,
  getShowSeatsFromTheatre,
  lockSeatAtTheatre,
  releaseSeatAtTheatre,
  getBookingStatusFromTheatre,
  cancelBookingAtTheatre,
  completeBookingCancellationAtTheatre,
  saveCheckoutSessionAtTheatre,
} from "../services/theatreApi.service";
import {
  createCheckoutSession,
  reconcilePaidBookingPayment,
  refundBookingPayment,
} from "../services/stripe.service";
import {
  createBookingCancellationToken,
  isValidBookingCancellationToken,
} from "../services/bookingCancellationToken.service";

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
    const customerEmail = String(req.body.customerEmail || "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return res.status(400).json({
        message: "A valid email address is required for the receipt",
      });
    }

    const result = await lockSeatAtTheatre(
      Array.isArray(req.body.showSeatIds)
        ? req.body.showSeatIds.map(Number)
        : Number(req.params.id),
      req.body.aggregatorName
    );

    let checkoutSession;
    let cancellationToken: string;

    try {
      cancellationToken = createBookingCancellationToken(
        result.bookingReference
      );
      checkoutSession = await createCheckoutSession(
        result.bookingReference,
        Number(result.totalAmount),
        customerEmail,
        cancellationToken
      );
      await saveCheckoutSessionAtTheatre(
        result.bookingReference,
        checkoutSession.id
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
      cancellationToken,
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
    try {
      await reconcilePaidBookingPayment(req.params.bookingReference);
    } catch (reconciliationError) {
      console.error("BOOKING PAYMENT RECONCILIATION ERROR:", reconciliationError);
    }

    const booking = await getBookingStatusFromTheatre(
      req.params.bookingReference
    );

    const { stripe_checkout_session_id: _checkoutSessionId, ...publicBooking } = booking;
    res.json(publicBooking);
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

    if (
      !isValidBookingCancellationToken(
        bookingReference,
        req.header("x-booking-cancellation-token")
      )
    ) {
      return res.status(401).json({
        message: "Valid booking cancellation token required",
      });
    }

    const cancellation = await cancelBookingAtTheatre(bookingReference);
    const booking = cancellation.booking;

    if (booking.booking_status === "CANCELLED") {
      return res.json(cancellation);
    }

    if (!booking.stripe_checkout_session_id) {
      throw new Error("Booking has no saved Stripe Checkout Session");
    }

    await refundBookingPayment(booking.stripe_checkout_session_id);

    const result = await completeBookingCancellationAtTheatre(
      bookingReference
    );
    res.json(result);
  } catch (error) {
    console.error("CANCEL BOOKING ERROR:", error);
    res.status(409).json({
      message: error instanceof Error ? error.message : "Failed to cancel booking",
    });
  }
});


export default router;