import express from "express";
import { SeatController } from "../controllers/seat.controller";


const router = express.Router();

const seatController = new SeatController();

router.post("/seats", seatController.createSeat.bind(seatController));

router.put("/seats/:id", seatController.updateSeat.bind(seatController));

router.delete("/seats/:id", seatController.deleteSeat.bind(seatController));

router.get("/seats",seatController.getAllSeats.bind(seatController));

router.get("/seats/:id",seatController.getSeatById.bind(seatController));

export default router;