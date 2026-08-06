import { Router } from "express";
import * as MovieController from "../controllers/movie.controller";

const router = Router();

router.post("/movies", MovieController.createMovie);

router.get("/movies", MovieController.getAllMovies);

router.get("/movies/:id", MovieController.getMovieById);

router.put("/movies/:id", MovieController.updateMovie);

router.delete("/movies/:id", MovieController.deleteMovie);

export default router;