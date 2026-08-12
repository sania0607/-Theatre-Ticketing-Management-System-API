import { Request, Response } from "express";
import * as showSeatService from "../services/showseat.service";

export const createShowSeat = async (
  req: Request,
  res: Response
) => {
  try {
    const showSeat = await showSeatService.createShowSeat(
      req.body
    );

    res.status(201).json(showSeat);
} catch (error) {
  console.error("CREATE SHOW SEAT ERROR:", error);

  res.status(500).json({
    message: "Failed to create show seat",
  });
}
};

export const getAllShowSeats = async (
  _req: Request,
  res: Response
) => {
  try {
    const showSeats =
      await showSeatService.getAllShowSeats();

    res.json(showSeats);
  } catch (error) {
    console.error("GET SHOW SEATS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch show seats",
    });
  }
};

export const getShowSeatById = async (
  req: Request,
  res: Response
) => {
  try {
    const showSeat =
      await showSeatService.getShowSeatById(
        Number(req.params.id)
      );

    if (!showSeat) {
      return res.status(404).json({
        message: "Show seat not found",
      });
    }

    res.json(showSeat);
  } catch (error) {
    console.error("GET SHOW SEAT ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch show seat",
    });
  }
};

export const updateShowSeat = async (
  req: Request,
  res: Response
) => {
  try {
    const showSeat =
      await showSeatService.updateShowSeat(
        Number(req.params.id),
        req.body
      );

    if (!showSeat) {
      return res.status(404).json({
        message: "Show seat not found",
      });
    }

    res.json(showSeat);
  } catch (error) {
    console.error("UPDATE SHOW SEAT ERROR:", error);

    res.status(500).json({
      message: "Failed to update show seat",
    });
  }
};

export const deleteShowSeat = async (
  req: Request,
  res: Response
) => {
  try {
    const showSeat =
      await showSeatService.deleteShowSeat(
        Number(req.params.id)
      );

    if (!showSeat) {
      return res.status(404).json({
        message: "Show seat not found",
      });
    }

    res.json({
      message: "Show seat deleted successfully",
    });
  } catch (error) {
    console.error("DELETE SHOW SEAT ERROR:", error);

    res.status(500).json({
      message: "Failed to delete show seat",
    });
  }
};
export const lockShowSeat = async (
  req: Request,
  res: Response
) => {
  try {
    const showSeat = await showSeatService.lockShowSeat(
      Number(req.params.id)
    );

    res.json({
      message: "Show seat locked successfully",
      showSeat,
    });
  } catch (error: any) {
    console.error("LOCK SHOW SEAT ERROR:", error);

    if (error.message === "Show seat not found") {
      return res.status(404).json({
        message: "Show seat not found",
      });
    }

    if (error.message === "Seat is already booked") {
      return res.status(409).json({
        message: "Seat is already booked",
      });
    }

    if (error.message === "Seat is already locked") {
      return res.status(409).json({
        message: "Seat is already locked",
      });
    }

    res.status(500).json({
      message: "Failed to lock show seat",
    });
  }
};