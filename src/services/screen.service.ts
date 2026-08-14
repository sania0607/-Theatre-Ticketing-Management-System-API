import Screen from "../models/screen.model";

export const createScreen = async (screen: any) => {
  const {
    theatre_id,
    name,
    capacity,
  } = screen;

  const newScreen = await Screen.create({
    theatre_id,
    name,
    capacity,
  });

  return newScreen;
};

export const getAllScreens = async () => {
  const screens = await Screen.findAll({
    order: [["id", "ASC"]],
  });

  return screens;
};

export const getScreenById = async (id: number) => {
  const screen = await Screen.findByPk(id);

  return screen;
};

export const updateScreen = async (
  id: number,
  screen: any
) => {
  const {
    theatre_id,
    name,
    capacity,
  } = screen;

  const existingScreen = await Screen.findByPk(id);

  if (!existingScreen) {
    return null;
  }

  await existingScreen.update({
    theatre_id,
    name,
    capacity,
  });

  return existingScreen;
};

export const deleteScreen = async (id: number) => {
  const screen = await Screen.findByPk(id);

  if (!screen) {
    return null;
  }

  await screen.destroy();

  return screen;
};