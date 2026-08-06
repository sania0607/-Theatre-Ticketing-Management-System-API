import { Router } from "express";
import * as screenController from "../controllers/screen.controller";

const router = Router();

router.post("/screens", screenController.createScreen);

router.get("/screens", screenController.getAllScreens);

router.get("/screens/:id", screenController.getScreenById);

router.put("/screens/:id", screenController.updateScreen);

router.delete("/screens/:id", screenController.deleteScreen);

export default router;