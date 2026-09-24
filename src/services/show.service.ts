import Show from "../models/show.model";
import Movie from "../models/movie.model";
import Screen from "../models/screen.model";
import Seat from "../models/seat.model";
import ShowSeat from "../models/showseat.model";
import { sequelize } from "../config/sequelize";
import { Op } from "sequelize";

export const createShow = async (show: any) => {
  const {
    movie_id,
    screen_id,
    show_date,
    start_time,
    end_time,
    ticket_price,
  } = show;

  return await sequelize.transaction(async (transaction) => {
    // Create the show
    const newShow = await Show.create(
      {
        movie_id,
        screen_id,
        show_date,
        start_time,
        end_time,
        ticket_price,
      },
      { transaction }
    );

    // Get all seats belonging to this screen
    const seats = await Seat.findAll({
      where: {
        screen_id,
      },
      transaction,
    });

    // Create ShowSeat records for this particular show
    await ShowSeat.bulkCreate(
      seats.map((seat) => ({
        show_id: newShow.id,
        seat_id: seat.id,
        status: "AVAILABLE",
        locked_until: null,
      })),
      { transaction }
    );

    return newShow;
  });
};

export const getAllShows = async (movieId?: number) => {
  const shows = await Show.findAll({
    where: {
      end_time: {
        [Op.gt]: new Date(),
      },
      ...(movieId ? { movie_id: movieId } : {}),
    },
    order: [["id", "ASC"]],
  });

  return shows;
};

export const getShowById = async (id: number) => {
  const show = await Show.findByPk(id, {
    include: [
      {
        model: Movie,
        as: "movie",
      },
      {
        model: Screen,
        as: "screen",
      },
    ],
  });

  return show;
};

export const updateShow = async (
  id: number,
  show: any
) => {
  const {
    movie_id,
    screen_id,
    show_date,
    start_time,
    end_time,
    ticket_price,
  } = show;

  const existingShow = await Show.findByPk(id);

  if (!existingShow) {
    return null;
  }

  await existingShow.update({
    movie_id,
    screen_id,
    show_date,
    start_time,
    end_time,
    ticket_price,
  });

  return existingShow;
};

export const deleteShow = async (id: number) => {
  const show = await Show.findByPk(id);

  if (!show) {
    return null;
  }

  await show.destroy();

  return show;
};