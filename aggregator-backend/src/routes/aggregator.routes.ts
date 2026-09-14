import { Router } from "express";

import {
  getMoviesFromTheatre,
  getShowsFromTheatre,
  getShowSeatsFromTheatre,
  lockSeatAtTheatre,
  confirmBookingAtTheatre,
} from "../services/theatreApi.service";

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


router.get("/shows", async (_req, res) => {
  try {
    const shows = await getShowsFromTheatre();
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
      Number(req.params.id),
      req.body.aggregatorName,
      Number(req.body.totalAmount)
    );

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to lock seat",
    });
  }
});


router.post(
  "/bookings/:bookingReference/confirm",
  async (req, res) => {
    try {
      const result =
        await confirmBookingAtTheatre(
          req.params.bookingReference
        );

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Failed to confirm booking",
      });
    }
  }
);


export default router;