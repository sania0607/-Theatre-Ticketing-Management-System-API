import { Router } from "express";
import * as theatreController from "../controllers/theatre.controller";

const router = Router();

router.post("/theatres", theatreController.createTheatre);

router.get("/theatres", theatreController.getAllTheatres);

router.get("/theatres/:id", theatreController.getTheatreById);

router.put("/theatres/:id", theatreController.updateTheatre);

router.delete("/theatres/:id", theatreController.deleteTheatre);

export default router;