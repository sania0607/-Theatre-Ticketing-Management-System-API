import dotenv from "dotenv";
import path from "path";
import { Resend } from "resend";

import { createBookingCancellationToken } from "./bookingCancellationToken.service";

dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

export const sendBookingReceipt = async (
  bookingReference: string,
  checkoutSessionId: string,
  customerEmail: string | null | undefined,
  amountTotal: number | null
) => {
  if (!customerEmail) {
    console.warn(`No customer email available for booking ${bookingReference}`);
    return;
  }

  if (!resend) {
    console.warn("RESEND_API_KEY is not configured; booking receipt was not sent");
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  if (!from) {
    console.warn("RESEND_FROM_EMAIL is not configured; booking receipt was not sent");
    return;
  }

  const token = createBookingCancellationToken(bookingReference);
  const cancellationUrl = `${frontendUrl}/booking/${encodeURIComponent(bookingReference)}?payment=success#cancellationToken=${encodeURIComponent(token)}`;
  const escapedReference = escapeHtml(bookingReference);
  const formattedAmount = `₹${((amountTotal || 0) / 100).toFixed(2)}`;
  const result = await resend.emails.send(
    {
      from,
      to: customerEmail,
      subject: `MovieBox booking confirmed: ${bookingReference}`,
      text: [
        `Your MovieBox booking ${bookingReference} is confirmed.`,
        `Amount paid: ${formattedAmount}`,
        `To cancel this booking and request a refund, open: ${cancellationUrl}`,
      ].join("\n\n"),
      html: `<h1>Booking confirmed</h1><p>Your MovieBox booking <strong>${escapedReference}</strong> is confirmed.</p><p>Amount paid: <strong>${formattedAmount}</strong></p><p><a href="${cancellationUrl}">Cancel booking and request a refund</a></p>`,
    },
    {
      idempotencyKey: `booking-receipt-${checkoutSessionId}`,
    }
  );

  if (result.error) {
    throw new Error(`Failed to send booking receipt: ${result.error.message}`);
  }

  console.info("BOOKING RECEIPT ACCEPTED:", {
    bookingReference,
    emailId: result.data?.id,
  });
};