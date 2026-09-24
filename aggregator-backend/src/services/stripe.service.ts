import dotenv from "dotenv";
import path from "path";
import Stripe from "stripe";

import { confirmBookingAtTheatre } from "./theatreApi.service";

dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const getStripe = () => {
  if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  return new Stripe(stripeSecretKey);
};

export const createCheckoutSession = async (
  bookingReference: string,
  totalAmount: number
) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  return getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: `MovieBox booking ${bookingReference}`,
          },
          unit_amount: Math.round(totalAmount * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      bookingReference,
    },
    success_url: `${frontendUrl}/booking/${bookingReference}?payment=success`,
    cancel_url: `${frontendUrl}/booking/${bookingReference}?payment=cancelled`,
  });
};

export const handleStripeWebhook = async (
  payload: Buffer,
  signature: string | string[] | undefined
) => {
  if (!stripeWebhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }

  if (!signature || Array.isArray(signature)) {
    throw new Error("Missing Stripe webhook signature");
  }

  const event = getStripe().webhooks.constructEvent(
    payload,
    signature,
    stripeWebhookSecret
  );

  if (event.type !== "checkout.session.completed") {
    return;
  }

  const session = event.data.object;
  const bookingReference = session.metadata?.bookingReference;

  if (session.payment_status !== "paid" || !bookingReference) {
    return;
  }

  try {
    await confirmBookingAtTheatre(bookingReference);
  } catch (error: any) {
    if (error.message?.includes("Booking is not pending")) {
      return;
    }

    throw error;
  }
};

export const refundBookingPayment = async (bookingReference: string) => {
  const sessions = await getStripe().checkout.sessions.list({
    limit: 100,
  });

  const session = sessions.data.find(
    (item) => item.metadata?.bookingReference === bookingReference
  );

  if (!session || session.payment_status !== "paid") {
    return false;
  }

  if (typeof session.payment_intent !== "string") {
    throw new Error("Payment intent not found");
  }

  await getStripe().refunds.create({
    payment_intent: session.payment_intent,
  });

  return true;
};