import Show from "../models/show.model";
import Movie from "../models/movie.model";
import Screen from "../models/screen.model";

export const createShow = async (show: any) => {
  const {
    movie_id,
    screen_id,
    show_date,
    start_time,
    end_time,
    ticket_price,
  } = show;

  const newShow = await Show.create({
    movie_id,
    screen_id,
    show_date,
    start_time,
    end_time,
    ticket_price,
  });

  return newShow;
};

export const getAllShows = async () => {
  const shows = await Show.findAll({
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