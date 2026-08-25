import { Router } from "express";
import { BookingSeatController } from "../controllers/bookingseat.controller";

const router = Router();

const bookingSeatController = new BookingSeatController();

router.post("/booking-seats", bookingSeatController.createBookingSeat);

router.get("/booking-seats",bookingSeatController.getAllBookingSeats);

router.get("/booking-seats/:id",bookingSeatController.getBookingSeatById);

router.put("/booking-seats/:id",bookingSeatController.updateBookingSeat);

router.delete("/booking-seats/:id", bookingSeatController.deleteBookingSeat);

export default router;