import express from "express";
import * as seatController from "../controllers/seat.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { authenticateStaffOrClient } from "../middleware/authenticateStaffOrClient.middleware";
import { requireAccess } from "../middleware/resourceAccess.middleware";


const router = express.Router();

router.post("/seats", authenticateToken,seatController.createSeat);

router.put("/seats/:id", authenticateToken,seatController.updateSeat);

router.delete("/seats/:id", authenticateToken,seatController.deleteSeat);

router.get("/seats",authenticateStaffOrClient,requireAccess("read:seat"),seatController.getAllSeats);

router.get("/seats/:id",authenticateStaffOrClient,requireAccess("read:seat"),seatController.getSeatById);

export default router;