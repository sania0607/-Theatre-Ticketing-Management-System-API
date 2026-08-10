import { Router } from "express";
import * as bookingController from "../controllers/booking.controller";

const router = Router();

router.post("/bookings", bookingController.createBooking);

router.get("/bookings", bookingController.getAllBookings);

router.get("/bookings/:id", bookingController.getBookingById);

router.put("/bookings/:id", bookingController.updateBooking);

router.delete("/bookings/:id", bookingController.deleteBooking);

export default router;