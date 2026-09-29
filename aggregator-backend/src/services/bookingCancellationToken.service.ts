import { createHmac, timingSafeEqual } from "crypto";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});

const getCancellationSecret = () => {
  const secret = process.env.BOOKING_CANCELLATION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("A booking cancellation signing secret of at least 32 characters is required");
  }

  return secret;
};

const signBookingReference = (bookingReference: string) =>
  createHmac("sha256", getCancellationSecret())
    .update(bookingReference)
    .digest("base64url");

export const createBookingCancellationToken = (
  bookingReference: string
) => signBookingReference(bookingReference);

export const isValidBookingCancellationToken = (
  bookingReference: string,
  providedToken: string | undefined
) => {
  if (!providedToken) return false;

  const expectedToken = signBookingReference(bookingReference);
  const expected = Buffer.from(expectedToken);
  const provided = Buffer.from(providedToken);

  return expected.length === provided.length && timingSafeEqual(expected, provided);
};