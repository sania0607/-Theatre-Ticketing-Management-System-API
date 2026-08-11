import { Router } from "express";
import * as MovieController from "../controllers/movie.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/movies", authenticateToken,MovieController.createMovie);

router.get("/movies", authenticateToken,MovieController.getAllMovies);

router.get("/movies/:id", authenticateToken,MovieController.getMovieById);

router.put("/movies/:id",authenticateToken, MovieController.updateMovie);

router.delete("/movies/:id", authenticateToken,MovieController.deleteMovie);

export default router;