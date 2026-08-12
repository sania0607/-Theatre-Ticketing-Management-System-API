import { Router } from "express";
import * as bookingController from "../controllers/booking.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/bookings", authenticateToken,bookingController.createBooking);

router.get("/bookings",authenticateToken, bookingController.getAllBookings);

router.get("/bookings/:id",authenticateToken, bookingController.getBookingById);

router.put("/bookings/:id",authenticateToken, bookingController.updateBooking);

router.delete("/bookings/:id", authenticateToken,bookingController.deleteBooking);

router.post("/bookings/with-seat",authenticateToken,bookingController.createBookingWithSeat);
export default router;