import { Router } from "express";
import * as showSeatController from "../controllers/showseat.controller";

const router = Router();

router.post("/show-seats", showSeatController.createShowSeat);

router.get("/show-seats", showSeatController.getAllShowSeats);

router.get("/show-seats/:id", showSeatController.getShowSeatById);

router.put("/show-seats/:id", showSeatController.updateShowSeat);

router.delete("/show-seats/:id", showSeatController.deleteShowSeat);

export default router;
