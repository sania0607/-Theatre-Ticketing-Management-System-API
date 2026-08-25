import { Router } from "express";
import { ScreenController } from "../controllers/screen.controller";

const router = Router();

const screenController = new ScreenController();

router.post("/screens", screenController.createScreen.bind(screenController));

router.put("/screens/:id",screenController.updateScreen.bind(screenController));

router.delete("/screens/:id", screenController.deleteScreen.bind(screenController));

router.get("/screens",screenController.getAllScreens.bind(screenController));

router.get("/screens/:id",screenController.getScreenById.bind(screenController));

export default router;