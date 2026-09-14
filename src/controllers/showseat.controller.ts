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
async getAllShowSeats(req: Request, res: Response) {
  try {
    const showId = Number(req.query.show_id);

    if (!showId) {
      return res.status(400).json({
        message: "show_id is required",
      });
    }

    const showSeats =
      await showSeatService.getShowSeatsByShowId(showId);

    res.json(showSeats);
  } catch (error) {
    console.error("GET SHOW SEATS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch show seats",
    });
  }
};

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
  totalAmount
} = req.body;

if (!aggregatorName || totalAmount === undefined) {
  return res.status(400).json({
    message: "aggregatorName and totalAmount are required"
  });
}

const result = await showSeatService.lockShowSeat(
  Number(req.params.id),
  aggregatorName,
  Number(totalAmount)
);

res.json({
  message: "Show seat locked successfully",
  bookingReference: result.booking.booking_reference,
  bookingStatus: result.booking.booking_status,
  lockedUntil: result.showSeat.locked_until,
  showSeat: result.showSeat,
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
  }
}