import { Router } from "express";
import * as showSeatController from "../controllers/showseat.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { authenticateStaffOrClient } from "../middleware/authenticateStaffOrClient.middleware";
import { requireAccess } from "../middleware/resourceAccess.middleware";


const router = Router();

router.post("/show-seats",authenticateToken, showSeatController.createShowSeat);

router.put("/show-seats/:id", authenticateToken,showSeatController.updateShowSeat);

router.delete("/show-seats/:id",authenticateToken, showSeatController.deleteShowSeat);

router.post("/show-seats/:id/lock",authenticateToken, showSeatController.lockShowSeat);

router.get("/show-seats",authenticateStaffOrClient,requireAccess("read:seat"),showSeatController.getAllShowSeats);

router.get("/show-seats/:id",authenticateStaffOrClient,requireAccess("read:seat"),showSeatController.getShowSeatById);

export default router;
