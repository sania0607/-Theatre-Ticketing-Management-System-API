import { Request, Response } from "express";
import { authenticateStaffOrClient } from "../middleware/authenticateStaffOrClient.middleware";

export function Authenticate() {
  return function (
    originalMethod: (
      req: Request,
      res: Response
    ) => any,
    context: ClassMethodDecoratorContext
  ) {
    return async function (
      this: any,
      req: Request,
      res: Response
    ): Promise<any> {

      let authenticated = false;

      await new Promise<void>((resolve) => {
        authenticateStaffOrClient(
          req,
          res,
          () => {
            authenticated = true;
            resolve();
          }
        );

        // If authentication failed,
        // the middleware has already sent the response.
        if (res.headersSent) {
          resolve();
        }
      });

      if (!authenticated) {
        return;
      }

      return originalMethod.call(
        this,
        req,
        res
      );
    };
  };
}

export function Authorize(requiredAccess: string) {
  return function (
    originalMethod: (
      req: Request,
      res: Response
    ) => any,
    context: ClassMethodDecoratorContext
  ) {
    return function (
      this: any,
      req: Request,
      res: Response
    ): any {

      // Staff authenticated through JWT
      if ((req as any).user) {
        return originalMethod.call(
          this,
          req,
          res
        );
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

      return originalMethod.call(
        this,
        req,
        res
      );
    };
  };
}

export function StaffOnly() {
  return function (
    originalMethod: (
      req: Request,
      res: Response
    ) => any,
    context: ClassMethodDecoratorContext
  ) {
    return function (
      this: any,
      req: Request,
      res: Response
    ): any {

      // Staff authenticated through JWT
      if ((req as any).user) {
        return originalMethod.call(
          this,
          req,
          res
        );
      }

      // Client is not allowed
      return res.status(403).json({
        message: "Staff access required",
      });
    };
  };
}