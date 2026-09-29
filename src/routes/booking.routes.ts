import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";

const router = Router();

const bookingController = new BookingController();

router.post("/bookings",bookingController.createBooking.bind(bookingController));


router.get("/bookings",bookingController.getAllBookings.bind(bookingController));

router.post("/bookings/:bookingReference/confirm",bookingController.confirmBooking.bind(bookingController));

router.post("/bookings/:bookingReference/cancel",bookingController.cancelBooking.bind(bookingController));

router.post("/bookings/:bookingReference/checkout-session",bookingController.setCheckoutSession.bind(bookingController));

router.post("/bookings/:bookingReference/complete-cancel",bookingController.completeBookingCancellation.bind(bookingController));

router.get("/bookings/:bookingReference/status",bookingController.getBookingByReference.bind(bookingController));

router.get("/bookings/:id",bookingController.getBookingById.bind(bookingController));

router.put("/bookings/:id",bookingController.updateBooking.bind(bookingController));

router.delete("/bookings/:id",bookingController.deleteBooking.bind(bookingController));

export default router;