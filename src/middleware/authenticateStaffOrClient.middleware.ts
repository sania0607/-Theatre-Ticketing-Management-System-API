import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../config/database";
import { authenticateClient } from "./clientAuth.middleware";

export const authenticateStaffOrClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // Try JWT authentication (staff or client)
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as any;

      // Client JWT
      if (decoded.type === "client") {
        const result = await pool.query(
          "SELECT * FROM client WHERE id = $1",
          [decoded.clientId]
        );

        if (result.rows.length === 0) {
          return res.status(401).json({
            message: "Client not found",
          });
        }

        (req as any).client = result.rows[0];

        return next();
      }

      // Staff JWT
      (req as any).user = decoded;

      return next();
    } catch {
      // JWT failed, try RSA client authentication
    }
  }

  // RSA client authentication
  return authenticateClient(req, res, next);
};