import { Request, Response, NextFunction } from "express";

export const requireAccess = (requiredAccess: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Staff authenticated through JWT
    if ((req as any).user) {
      return next();
    }

    // Client authenticated through RSA
    const client = (req as any).client;

    if (!client) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const access = client.access
      ? client.access
          .split(",")
          .map((item: string) => item.trim())
      : [];

    if (!access.includes(requiredAccess)) {
      return res.status(403).json({
        message: "Client does not have required access",
      });
    }

    next();
  };
};