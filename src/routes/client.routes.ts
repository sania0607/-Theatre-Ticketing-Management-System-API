import { Router, Request, Response } from "express";
import { authenticateClient } from "../middleware/clientAuth.middleware";

const router = Router();

router.post(
  "/client-test",
  authenticateClient,
  (req: Request, res: Response) => {
    res.json({
      message: "Client authenticated successfully",
      client: (req as any).client.client_code,
    });
  }
);

export default router;