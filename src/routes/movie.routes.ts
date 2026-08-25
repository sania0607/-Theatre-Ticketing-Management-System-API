import { Router } from "express";
import { MovieController } from "../controllers/movie.controller";


const router = Router();

const movieController = new MovieController();

router.post("/movies",  movieController.createMovie.bind(movieController));

router.put("/movies/:id",movieController.updateMovie.bind(movieController));

router.delete("/movies/:id", movieController.deleteMovie.bind(movieController));

router.get("/movies",movieController.getAllMovies.bind(movieController));

router.get("/movies/:id",movieController.getMovieById.bind(movieController)
);

export default router;