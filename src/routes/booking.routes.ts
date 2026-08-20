import { Router } from "express";
import * as bookingController from "../controllers/booking.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { authenticateStaffOrClient } from "../middleware/authenticateStaffOrClient.middleware";
import { requireAccess } from "../middleware/resourceAccess.middleware";

const router = Router();


router.post("/bookings",authenticateStaffOrClient,requireAccess("create:booking"),bookingController.createBooking);


router.get("/bookings",authenticateStaffOrClient,requireAccess("read:booking"),bookingController.getAllBookings);

router.post("/bookings/:bookingReference/confirm",authenticateStaffOrClient,requireAccess("confirm:booking"),bookingController.confirmBooking);

router.get("/bookings/:id",authenticateStaffOrClient,requireAccess("read:booking"),bookingController.getBookingById);

router.put("/bookings/:id",authenticateToken,bookingController.updateBooking);

router.delete("/bookings/:id",authenticateToken,bookingController.deleteBooking);

export default router;