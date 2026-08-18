import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { pool } from "../config/database";

export const authenticateClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clientCode = req.headers["x-client-code"] as string;
    const timestamp = req.headers["x-timestamp"] as string;
    const signature = req.headers["x-signature"] as string;

    if (!clientCode || !timestamp || !signature) {
      return res.status(401).json({
        message:
          "Client code, timestamp and signature are required",
      });
    }

    // Find client
    const result = await pool.query(
      "SELECT * FROM client WHERE client_code = $1",
      [clientCode]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid client",
      });
    }

    const client = result.rows[0];

    // Check timestamp
    const requestTime = Number(timestamp);
    const currentTime = Date.now();

    if (
      !Number.isFinite(requestTime) ||
      Math.abs(currentTime - requestTime) > 5 * 60 * 1000
    ) {
      return res.status(401).json({
        message: "Request timestamp expired",
      });
    }

    // Data must be EXACTLY the same data
    // that the client signed.
    const body = JSON.stringify(req.body || {});

    const data = [
      clientCode,
      timestamp,
      req.method,
      req.originalUrl,
      body,
    ].join("|");

    // Verify RSA signature
    const verifier = crypto.createVerify("RSA-SHA256");

    verifier.update(data);
    verifier.end();

    const isValid = verifier.verify(
      client.public_key,
      signature,
      "base64"
    );

    if (!isValid) {
      return res.status(403).json({
        message: "Invalid RSA signature",
      });
    }

    // Client successfully authenticated
    (req as any).client = client;

    next();
  } catch (error) {
    console.error("CLIENT AUTH ERROR:", error);

    return res.status(500).json({
      message: "Client authentication failed",
    });
  }
};