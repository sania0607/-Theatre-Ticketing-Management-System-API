import express from "express";
import { ShowController } from "../controllers/show.controller";

const router = express.Router();

const showController = new ShowController();

router.post("/shows",showController.createShow);

router.put("/shows/:id", showController.updateShow);

router.delete("/shows/:id",showController.deleteShow);

router.get("/shows",showController.getAllShows);

router.get("/shows/:id",showController.getShowById);

export default router;