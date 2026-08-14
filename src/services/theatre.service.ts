import Theatre from "../models/theatre.model";

export const createTheatre = async (theatre: any) => {
  const {name,address,city,state,contact_number,} = theatre;

  const newTheatre = await Theatre.create({
    name,
    address,
    city,
    state,
    contact_number,
  });

  return newTheatre;
};

export const getAllTheatres = async () => {
  const theatres = await Theatre.findAll({
    order: [["id", "ASC"]],
  });

  return theatres;
};

export const getTheatreById = async (id: number) => {
  const theatre = await Theatre.findByPk(id);

  return theatre;
};

export const updateTheatre = async (
  id: number,
  theatre: any
) => {
  const {
    name,
    address,
    city,
    state,
    contact_number,
  } = theatre;

  const existingTheatre = await Theatre.findByPk(id);

  if (!existingTheatre) {
    return null;
  }

  await existingTheatre.update({
    name,
    address,
    city,
    state,
    contact_number,
  });

  return existingTheatre;
};

export const deleteTheatre = async (id: number) => {
  const theatre = await Theatre.findByPk(id);

  if (!theatre) {
    return null;
  }

  await theatre.destroy();

  return theatre;
};