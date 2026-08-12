import { Router } from "express";
import * as showSeatController from "../controllers/showseat.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/show-seats",authenticateToken, showSeatController.createShowSeat);

router.get("/show-seats", authenticateToken,showSeatController.getAllShowSeats);

router.get("/show-seats/:id",authenticateToken, showSeatController.getShowSeatById);

router.put("/show-seats/:id", authenticateToken,showSeatController.updateShowSeat);

router.delete("/show-seats/:id",authenticateToken, showSeatController.deleteShowSeat);

router.post("/show-seats/:id/lock",authenticateToken, showSeatController.lockShowSeat
);
export default router;
