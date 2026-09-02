import { Request, Response } from "express";
import { generateClientToken } from "../services/auth.service";

export class AuthController {
  async clientLogin(req: Request, res: Response) {
    try {
      const client = (req as any).client;

      if (!client) {
        return res.status(401).json({
          message: "Client authentication required",
        });
      }

      const token = generateClientToken(
        client.id,
        client.client_name
      );

      return res.status(200).json({
        message: "Client authenticated successfully",
        token,
      });
    } catch (error) {
      console.error("CLIENT JWT ERROR:", error);

      return res.status(500).json({
        message: "Failed to generate client token",
      });
    }
  }
}