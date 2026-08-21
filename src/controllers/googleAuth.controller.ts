import { Request, Response, NextFunction } from "express";
import passport from "../config/passport";
import jwt from "jsonwebtoken";

export const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "google",
    { session: false },
    (err: any, staff: any) => {
      if (err) {
        console.error("GOOGLE AUTH ERROR:", err);

        return res.status(500).json({
          message: "Google authentication failed",
        });
      }

      if (!staff) {
        return res.status(401).json({
          message: "Google account is not authorized as staff",
        });
      }

      const token = jwt.sign(
        {
          id: staff.id,
          username: staff.username,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1h",
        }
      );

      return res.json({
        message: "Google login successful",
        id: staff.id,
        username: staff.username,
        accessToken: token,
      });
    }
  )(req, res, next);
};