import { Request, Response } from "express";
import * as showSeatService from "../services/showseat.service";
import { Authenticate, Authorize, StaffOnly } from "../decorators/auth.decorator";

export class ShowSeatController {

@Authenticate()
@StaffOnly()
async createShowSeat(req: Request, res: Response) {
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

@Authenticate()
@Authorize("read:showseats")
async getAllShowSeats(_req: Request, res: Response) {
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
}


@Authenticate()
@Authorize("read:showseats")
async getShowSeatById(req: Request, res: Response) {

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

@Authenticate()
@StaffOnly()
async updateShowSeat(req: Request, res: Response) {
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

@Authenticate()
@StaffOnly()
async deleteShowSeat(req: Request, res: Response) {
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

@Authenticate()
@Authorize("create:booking")
async lockShowSeat(req: Request, res: Response) {
  try {
    const {
      aggregatorName,
      showSeatIds,
    } = req.body;

const requestedSeatIds = Array.isArray(showSeatIds)
  ? showSeatIds.map(Number)
  : [Number(req.params.id)];

if (!aggregatorName || requestedSeatIds.length === 0 || requestedSeatIds.some((id) => !Number.isInteger(id) || id <= 0)) {
  return res.status(400).json({
    message: "aggregatorName and valid seats are required"
  });
}

const result = await showSeatService.lockShowSeats(
  requestedSeatIds,
  aggregatorName
);

res.json({
  message: "Show seat locked successfully",
  bookingReference: result.booking.booking_reference,
  bookingStatus: result.booking.booking_status,
  totalAmount: result.totalAmount,
  lockedUntil: result.showSeats[0].locked_until,
  showSeats: result.showSeats,
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

  @Authenticate()
  @Authorize("create:booking")
  async releaseShowSeat(req: Request, res: Response) {
    try {
      const showSeat = await showSeatService.releaseShowSeat(
        Number(req.params.id)
      );

      res.json(showSeat);
    } catch (error) {
      console.error("RELEASE SHOW SEAT ERROR:", error);
      res.status(500).json({
        message: "Failed to release show seat",
      });
    }
  }
}