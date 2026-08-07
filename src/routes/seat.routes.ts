import express from "express";
import * as seatController from "../controllers/seat.controller";

const router = express.Router();

router.post("/seats", seatController.createSeat);

router.get("/seats", seatController.getAllSeats);

router.get("/seats/:id", seatController.getSeatById);

router.put("/seats/:id", seatController.updateSeat);

router.delete("/seats/:id", seatController.deleteSeat);

export default router;