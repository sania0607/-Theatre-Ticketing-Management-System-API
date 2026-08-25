import { Request, Response } from "express";
import * as ScreenService from "../services/screen.service";
import {Authenticate,Authorize,} from "../decorators/auth.decorator";


export class ScreenController {

@Authenticate()
async createScreen(req: Request, res: Response) {
  try {
    const screen = await ScreenService.createScreen(req.body);

    res.status(201).json(screen);
  } catch (error) {
    res.status(500).json({
      message: "Error creating screen",
    });
  }
};

@Authenticate()
@Authorize("read:screen")
async getAllScreens(req: Request, res: Response) {
  try {
    const screens = await ScreenService.getAllScreens();

    res.json(screens);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching screens",
    });
  }
};

@Authenticate()
@Authorize("read:screen")
async getScreenById(req: Request, res: Response) {
  try {
    const screen = await ScreenService.getScreenById(
      Number(req.params.id)
    );

    if (!screen) {
      return res.status(404).json({
        message: "Screen not found",
      });
    }

    res.json(screen);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching screen",
    });
  }
};

@Authenticate()
async updateScreen(req: Request, res: Response) {
  try {
    const screen = await ScreenService.updateScreen(
      Number(req.params.id),
      req.body
    );

    if (!screen) {
      return res.status(404).json({
        message: "Screen not found",
      });
    }

    res.json(screen);
  } catch (error) {
    res.status(500).json({
      message: "Error updating screen",
    });
  }
};

 @Authenticate()
  async deleteScreen(req: Request, res: Response) {
  try {
    const screen = await ScreenService.deleteScreen(
      Number(req.params.id)
    );

    if (!screen) {
      return res.status(404).json({
        message: "Screen not found",
      });
    }

    res.json({
      message: "Screen deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting screen",
      });
    }
  }
}