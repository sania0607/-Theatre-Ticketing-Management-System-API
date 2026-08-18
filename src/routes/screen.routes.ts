import { Router } from "express";
import * as screenController from "../controllers/screen.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { authenticateStaffOrClient } from "../middleware/authenticateStaffOrClient.middleware";
import { requireAccess } from "../middleware/resourceAccess.middleware";

const router = Router();

router.post("/screens",authenticateToken, screenController.createScreen);

router.put("/screens/:id", authenticateToken,screenController.updateScreen);

router.delete("/screens/:id", authenticateToken,screenController.deleteScreen);

router.get("/screens",authenticateStaffOrClient,requireAccess("read:screen"),screenController.getAllScreens);

router.get("/screens/:id",authenticateStaffOrClient,requireAccess("read:screen"),screenController.getScreenById);

export default router;