import { Router } from "express";
import * as theatreController from "../controllers/theatre.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/theatres", authenticateToken,theatreController.createTheatre);

router.get("/theatres", authenticateToken,theatreController.getAllTheatres);

router.get("/theatres/:id", authenticateToken,theatreController.getTheatreById);

router.put("/theatres/:id", authenticateToken,theatreController.updateTheatre);

router.delete("/theatres/:id", authenticateToken,theatreController.deleteTheatre);

export default router;