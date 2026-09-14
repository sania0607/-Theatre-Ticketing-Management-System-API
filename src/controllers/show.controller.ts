import { Request, Response } from "express";
import * as showService from "../services/show.service";
import { Authenticate, Authorize, StaffOnly } from "../decorators/auth.decorator";

export class ShowController {

@Authenticate()
@StaffOnly()
async createShow(req: Request, res: Response) {
  try {
    const show = await showService.createShow(req.body);

    res.status(201).json(show);
  } catch (error) {
    console.error("CREATE SHOW ERROR:", error);

    res.status(500).json({
      message: "Failed to create show",
    });
  }
};

@Authenticate()
@Authorize("read:show")
async getAllShows(_req: Request, res: Response) {
  try {
    const shows = await showService.getAllShows();

    res.json(shows);
  } catch (error) {
    console.error("GET SHOWS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch shows",
    });
  }
};

@Authenticate()
@Authorize("read:show")
async getShowById(req: Request, res: Response) {
  try {
    const show = await showService.getShowById(
      Number(req.params.id)
    );

    if (!show) {
      return res.status(404).json({
        message: "Show not found",
      });
    }

    res.json(show);
  } catch (error) {
    console.error("GET SHOW ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch show",
    });
  }
};

@Authenticate()
@StaffOnly()
async updateShow(req: Request, res: Response) {
  try {
    const show = await showService.updateShow(
      Number(req.params.id),
      req.body
    );

    if (!show) {
      return res.status(404).json({
        message: "Show not found",
      });
    }

    res.json(show);
  } catch (error) {
    console.error("UPDATE SHOW ERROR:", error);

    res.status(500).json({
      message: "Failed to update show",
    });
  }
};

@Authenticate()
@StaffOnly()
async deleteShow(req: Request, res: Response) {
  try {
    const show = await showService.deleteShow(
      Number(req.params.id)
    );

    if (!show) {
      return res.status(404).json({
        message: "Show not found",
      });
    }

    res.json({
      message: "Show deleted successfully",
    });
  } catch (error) {
    console.error("DELETE SHOW ERROR:", error);

    res.status(500).json({
      message: "Failed to delete show",
      });
    }
  }
}