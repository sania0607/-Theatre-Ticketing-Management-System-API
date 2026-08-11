import { Router } from "express";
import * as screenController from "../controllers/screen.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/screens",authenticateToken, screenController.createScreen);

router.get("/screens",authenticateToken, screenController.getAllScreens);

router.get("/screens/:id", authenticateToken,screenController.getScreenById);

router.put("/screens/:id", authenticateToken,screenController.updateScreen);

router.delete("/screens/:id", authenticateToken,screenController.deleteScreen);

export default router;