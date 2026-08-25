import { Request, Response } from "express";
import * as staffService from "../services/staff.service";

export class StaffController {

  async createStaff(req: Request, res: Response) {
    try{
    const { username, password } = req.body;

    const staff = await staffService.createStaff(username, password);

    res.status(201).json(staff);
  } catch (error) {
    console.error("CREATE STAFF ERROR:", error);

    res.status(500).json({
      message: "Failed to create staff",
    });
  }
};

async loginStaff(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    const staff = await staffService.loginStaff(username, password);

    if (!staff) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    res.json(staff);
  } catch (error) {
    console.error("STAFF LOGIN ERROR:", error);

    res.status(500).json({
      message: "Failed to login",
      });
    }
  }
}