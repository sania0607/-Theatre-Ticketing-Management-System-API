import express from "express";
import * as seatController from "../controllers/seat.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/seats", authenticateToken,seatController.createSeat);

router.get("/seats", authenticateToken,seatController.getAllSeats);

router.get("/seats/:id",authenticateToken, seatController.getSeatById);

router.put("/seats/:id", authenticateToken,seatController.updateSeat);

router.delete("/seats/:id", authenticateToken,seatController.deleteSeat);

export default router;