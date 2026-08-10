import { Router } from "express";
import * as staffController from "../controllers/staff.controller";

const router = Router();

router.post("/staff", staffController.createStaff);

router.post("/staff/login", staffController.loginStaff);

export default router;