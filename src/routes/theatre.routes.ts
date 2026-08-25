import { Router } from "express";
import { TheatreController } from "../controllers/theatre.controller";

const router = Router();

const theatreController = new TheatreController();

router.post("/theatres", theatreController.createTheatre.bind(theatreController));

router.put("/theatres/:id", theatreController.updateTheatre.bind(theatreController));

router.delete("/theatres/:id", theatreController.deleteTheatre.bind(theatreController));

router.get("/theaters",theatreController.getAllTheatres.bind(theatreController));

router.get("/theaters/:id",theatreController.getTheatreById.bind(theatreController));


export default router;