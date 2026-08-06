import { Request, Response } from "express";
import * as theatreService from "../services/theatre.service";

export const createTheatre = async (req: Request, res: Response) => {
  try {
    const theatre = await theatreService.createTheatre(req.body);

    res.status(201).json(theatre);
  } catch (error) {
    res.status(500).json({ message: "Error creating theatre" });
  }
};

export const getAllTheatres = async (req: Request, res: Response) => {
  try {
    const theatres = await theatreService.getAllTheatres();

    res.json(theatres);
  } catch (error) {
    res.status(500).json({ message: "Error fetching theatres" });
  }
};

export const getTheatreById = async (req: Request, res: Response) => {
  try {
    const theatre = await theatreService.getTheatreById(
      Number(req.params.id)
    );

    if (!theatre) {
      return res.status(404).json({
        message: "Theatre not found",
      });
    }

    res.json(theatre);
  } catch (error) {
    res.status(500).json({ message: "Error fetching theatre" });
  }
};

export const updateTheatre = async (req: Request, res: Response) => {
  try {
    const theatre = await theatreService.updateTheatre(
      Number(req.params.id),
      req.body
    );

    if (!theatre) {
      return res.status(404).json({
        message: "Theatre not found",
      });
    }

    res.json(theatre);
  } catch (error) {
    res.status(500).json({ message: "Error updating theatre" });
  }
};

export const deleteTheatre = async (req: Request, res: Response) => {
  try {
    const theatre = await theatreService.deleteTheatre(
      Number(req.params.id)
    );

    if (!theatre) {
      return res.status(404).json({
        message: "Theatre not found",
      });
    }

    res.json({
      message: "Theatre deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting theatre" });
  }
};