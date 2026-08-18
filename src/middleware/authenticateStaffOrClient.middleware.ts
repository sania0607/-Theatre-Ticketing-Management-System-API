import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authenticateClient } from "./clientAuth.middleware";

export const authenticateStaffOrClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // Try staff JWT authentication
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      );

      (req as any).user = decoded;

      return next();
    } catch {
      // JWT failed, so try client authentication
    }
  }

  // Try RSA client authentication
  return authenticateClient(req, res, next);
};