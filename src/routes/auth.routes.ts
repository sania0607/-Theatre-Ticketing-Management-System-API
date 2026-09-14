import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticateClient } from "../middleware/clientAuth.middleware";

const router = express.Router();

const authController = new AuthController();

router.post("/client/login",authenticateClient,authController.clientLogin.bind(authController));

export default router;