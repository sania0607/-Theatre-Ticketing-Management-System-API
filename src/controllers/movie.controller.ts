import { Request, Response } from "express";
import * as MovieService from "../services/movie.service";

export const createMovie = async (req: Request, res: Response) => {
  try {
    const movie = await MovieService.createMovie(req.body);

    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({
      message: "Error creating movie",
    });
  }
};

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const movies = await MovieService.getAllMovies();

    res.json(movies);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching movies",
    });
  }
};

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const movie = await MovieService.getMovieById(
      Number(req.params.id)
    );

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching movie",
    });
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  try {
    const movie = await MovieService.updateMovie(
      Number(req.params.id),
      req.body
    );

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({
      message: "Error updating movie",
    });
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const movie = await MovieService.deleteMovie(
      Number(req.params.id)
    );

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.json({
      message: "Movie deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting movie",
    });
  }
};