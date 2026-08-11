import express from "express";
import * as showController from "../controllers/show.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/shows", authenticateToken,showController.createShow);

router.get("/shows", authenticateToken,showController.getAllShows);

router.get("/shows/:id", authenticateToken,showController.getShowById);

router.put("/shows/:id", authenticateToken,showController.updateShow);

router.delete("/shows/:id",authenticateToken, showController.deleteShow);

export default router;