import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Staff from "../models/staff.model";

export const createStaff = async (
  username: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const staff = await Staff.create({
    username,
    password: hashedPassword,
  });

  return {
    id: staff.id,
    username: staff.username,
  };
};

export const loginStaff = async (
  username: string,
  password: string
) => {
  const staff = await Staff.findOne({
    where: {
      username,
    },
  });

  if (!staff) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    staff.password
  );

  if (!isPasswordValid) {
    return null;
  }

  const token = jwt.sign(
    {
      id: staff.id,
      username: staff.username,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "2h",
    }
  );

  return {
    id: staff.id,
    username: staff.username,
    accessToken: token,
  };
};