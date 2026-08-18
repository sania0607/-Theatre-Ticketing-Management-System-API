import express from "express";
import * as showController from "../controllers/show.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { authenticateStaffOrClient } from "../middleware/authenticateStaffOrClient.middleware";
import { requireAccess } from "../middleware/resourceAccess.middleware";


const router = express.Router();

router.post("/shows", authenticateToken,showController.createShow);

router.put("/shows/:id", authenticateToken,showController.updateShow);

router.delete("/shows/:id",authenticateToken, showController.deleteShow);

router.get("/shows",authenticateStaffOrClient,requireAccess("read:show"),showController.getAllShows);

router.get("/shows/:id",authenticateStaffOrClient,requireAccess("read:show"),showController.getShowById);

export default router;