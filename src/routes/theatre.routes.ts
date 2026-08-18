import { Router } from "express";
import * as theatreController from "../controllers/theatre.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { authenticateStaffOrClient } from "../middleware/authenticateStaffOrClient.middleware";
import { requireAccess } from "../middleware/resourceAccess.middleware";


const router = Router();

router.post("/theatres", authenticateToken,theatreController.createTheatre);

router.put("/theatres/:id", authenticateToken,theatreController.updateTheatre);

router.delete("/theatres/:id", authenticateToken,theatreController.deleteTheatre);

router.get("/theaters",authenticateStaffOrClient,requireAccess("read:theater"),theatreController.getAllTheatres);

router.get("/theaters/:id",authenticateStaffOrClient,requireAccess("read:theater"),theatreController.getTheatreById);


export default router;