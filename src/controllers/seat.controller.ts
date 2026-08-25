import { Request, Response } from "express";
import * as seatService from "../services/seat.service";
import { Authenticate, Authorize } from "../decorators/auth.decorator";

export class SeatController {

@Authenticate()
async createSeat(req: Request, res: Response) {
  try {
    const seat = await seatService.createSeat(req.body);

    res.status(201).json(seat);
  } catch (error) {
    console.error("CREATE SEAT ERROR:", error);

    res.status(500).json({
      message: "Failed to create seat",
    });
  }
};

@Authenticate()
@Authorize("read:seat")
async getAllSeats(_req: Request, res: Response) {
  try {
    const seats = await seatService.getAllSeats();

    res.json(seats);
  } catch (error) {
    console.error("GET SEATS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch seats",
    });
  }
};

@Authenticate()
@Authorize("read:seat")
async getSeatById(req: Request, res: Response) {
  try {
    const seat = await seatService.getSeatById(
      Number(req.params.id)
    );

    if (!seat) {
      return res.status(404).json({
        message: "Seat not found",
      });
    }

    res.json(seat);
  } catch (error) {
    console.error("GET SEAT ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch seat",
    });
  }
};

@Authenticate()
async updateSeat(req: Request, res: Response) {
  try {
    const seat = await seatService.updateSeat(
      Number(req.params.id),
      req.body
    );

    if (!seat) {
      return res.status(404).json({
        message: "Seat not found",
      });
    }

    res.json(seat);
  } catch (error) {
    console.error("UPDATE SEAT ERROR:", error);

    res.status(500).json({
      message: "Failed to update seat",
    });
  }
};

@Authenticate()
async deleteSeat(req: Request, res: Response) {
  try {
    const seat = await seatService.deleteSeat(
      Number(req.params.id)
    );

    if (!seat) {
      return res.status(404).json({
        message: "Seat not found",
      });
    }

    res.json({
      message: "Seat deleted successfully",
    });
  } catch (error) {
    console.error("DELETE SEAT ERROR:", error);

    res.status(500).json({
      message: "Failed to delete seat",
      });
    }
  }
}