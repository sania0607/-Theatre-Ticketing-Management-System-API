import { Router } from "express";
import * as MovieController from "../controllers/movie.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { authenticateStaffOrClient } from "../middleware/authenticateStaffOrClient.middleware";
import { requireAccess } from "../middleware/resourceAccess.middleware";


const router = Router();

router.post("/movies", authenticateToken,MovieController.createMovie);

router.put("/movies/:id",authenticateToken, MovieController.updateMovie);

router.delete("/movies/:id", authenticateToken,MovieController.deleteMovie);

router.get("/movies",authenticateStaffOrClient,requireAccess("read:movie"),MovieController.getAllMovies);

router.get("/movies/:id",authenticateStaffOrClient,requireAccess("read:movie"),MovieController.getMovieById);

export default router;