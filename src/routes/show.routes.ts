import express from "express";
import * as showController from "../controllers/show.controller";

const router = express.Router();

router.post("/shows", showController.createShow);

router.get("/shows", showController.getAllShows);

router.get("/shows/:id", showController.getShowById);

router.put("/shows/:id", showController.updateShow);

router.delete("/shows/:id", showController.deleteShow);

export default router;