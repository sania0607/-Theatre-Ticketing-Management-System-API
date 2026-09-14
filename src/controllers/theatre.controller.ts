import { Request, Response } from "express";
import * as theatreService from "../services/theatre.service";
import { Authenticate, Authorize, StaffOnly } from "../decorators/auth.decorator";


export class TheatreController {

@Authenticate()
@StaffOnly()
async createTheatre(req: Request, res: Response) {
  try {
    const theatre = await theatreService.createTheatre(req.body);

    res.status(201).json(theatre);
  } catch (error) {
    res.status(500).json({ message: "Error creating theatre" });
  }
};

@Authenticate()
@Authorize("read:theatre")
  async getAllTheatres(req: Request, res: Response) {
  try {
    const theatres = await theatreService.getAllTheatres();

    res.json(theatres);
  } catch (error) {
    res.status(500).json({ message: "Error fetching theatres" });
  }
};

@Authenticate()
@Authorize("read:theatre")
  async getTheatreById(req: Request, res: Response) {
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
@Authenticate()
@StaffOnly()
async updateTheatre(req: Request, res: Response) {
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

 @Authenticate()
 @StaffOnly()
 async deleteTheatre(req: Request, res: Response) {
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
    res.status(500).json({ 
      message: "Error deleting theatre",
      });
    }
  }
}