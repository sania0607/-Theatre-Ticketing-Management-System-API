import jwt from "jsonwebtoken";

export const generateClientToken = (
  clientId: number,
  clientName: string
) => {
  return jwt.sign(
    {
      type: "client",
      clientId,
      clientName,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "2h",
    }
  );
};