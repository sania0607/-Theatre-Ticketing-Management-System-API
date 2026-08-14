import Movie from "../models/movie.model";

export const createMovie = async (movie: any) => {
  const {
    title,
    genre,
    language,
    duration,
    release_date,
  } = movie;

  const newMovie = await Movie.create({
    title,
    genre,
    language,
    duration,
    release_date,
  });

  return newMovie;
};

export const getAllMovies = async () => {
  const movies = await Movie.findAll({
    order: [["id", "ASC"]],
  });

  return movies;
};

export const getMovieById = async (id: number) => {
  const movie = await Movie.findByPk(id);

  return movie;
};

export const updateMovie = async (
  id: number,
  movie: any
) => {
  const {
    title,
    genre,
    language,
    duration,
    release_date,
  } = movie;

  const existingMovie = await Movie.findByPk(id);

  if (!existingMovie) {
    return null;
  }

  await existingMovie.update({
    title,
    genre,
    language,
    duration,
    release_date,
  });

  return existingMovie;
};

export const deleteMovie = async (id: number) => {
  const movie = await Movie.findByPk(id);

  if (!movie) {
    return null;
  }

  await movie.destroy();

  return movie;
};