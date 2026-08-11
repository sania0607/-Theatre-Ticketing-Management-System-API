import { Router } from "express";
import * as bookingSeatController from "../controllers/bookingseat.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/booking-seats", authenticateToken,bookingSeatController.createBookingSeat);

router.get("/booking-seats",authenticateToken, bookingSeatController.getAllBookingSeats);

router.get("/booking-seats/:id",authenticateToken, bookingSeatController.getBookingSeatById);

router.put("/booking-seats/:id",authenticateToken, bookingSeatController.updateBookingSeat);

router.delete("/booking-seats/:id",authenticateToken, bookingSeatController.deleteBookingSeat);

export default router;