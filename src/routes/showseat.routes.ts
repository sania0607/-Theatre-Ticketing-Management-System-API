import { Router } from "express";
import { ShowSeatController } from "../controllers/showseat.controller";

const router = Router();

const showSeatController = new ShowSeatController();

router.post("/show-seats",showSeatController.createShowSeat.bind(showSeatController));

router.put("/show-seats/:id",showSeatController.updateShowSeat.bind(showSeatController));

router.delete("/show-seats/:id", showSeatController.deleteShowSeat.bind(showSeatController));

router.post("/show-seats/:id/lock",showSeatController.lockShowSeat.bind(showSeatController));

router.get("/show-seats",showSeatController.getAllShowSeats.bind(showSeatController));

router.get("/show-seats/:id",showSeatController.getShowSeatById.bind(showSeatController));

export default router;