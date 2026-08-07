import { Request, Response } from "express";
import * as ScreenService from "../services/screen.service";

export const createScreen = async (req: Request, res: Response) => {
  try {
    const screen = await ScreenService.createScreen(req.body);

    res.status(201).json(screen);
  } catch (error) {
    res.status(500).json({
      message: "Error creating screen",
    });
  }
};

export const getAllScreens = async (req: Request, res: Response) => {
  try {
    const screens = await ScreenService.getAllScreens();

    res.json(screens);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching screens",
    });
  }
};

export const getScreenById = async (req: Request, res: Response) => {
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

export const updateScreen = async (req: Request, res: Response) => {
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

export const deleteScreen = async (req: Request, res: Response) => {
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
};