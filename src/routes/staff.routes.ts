import { Router } from "express";
import { StaffController } from "../controllers/staff.controller";
import * as googleAuthController from "../controllers/googleAuth.controller";

const router = Router();

const staffController = new StaffController();

router.post("/staff", staffController.createStaff);

router.post("/staff/login", staffController.loginStaff);

// Google SSO
router.get("/auth/google", googleAuthController.googleLogin);

router.get("/auth/google/callback",googleAuthController.googleCallback);


export default router;