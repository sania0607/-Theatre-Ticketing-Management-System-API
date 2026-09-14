import { Router } from "express";
import { TheatreController } from "../controllers/theatre.controller";

const router = Router();

const theatreController = new TheatreController();

router.post("/theaters", theatreController.createTheatre.bind(theatreController));

router.put("/theaters/:id", theatreController.updateTheatre.bind(theatreController));

router.delete("/theaters/:id", theatreController.deleteTheatre.bind(theatreController));

router.get("/theaters",theatreController.getAllTheatres);

router.get("/theaters/:id",theatreController.getTheatreById.bind(theatreController));


export default router;