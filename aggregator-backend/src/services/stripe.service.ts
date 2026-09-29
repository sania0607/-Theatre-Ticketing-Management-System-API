import dotenv from "dotenv";
import path from "path";
import Stripe from "stripe";

import {
  cancelBookingAtTheatre,
  completeBookingCancellationAtTheatre,
  confirmBookingAtTheatre,
  getBookingStatusFromTheatre,
} from "./theatreApi.service";
import { sendBookingReceipt } from "./email.service";

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

const refundCheckoutSession = async (session: Stripe.Checkout.Session) => {
  const paymentIntent = session.payment_intent;

  if (typeof paymentIntent !== "string") {
    throw new Error("Payment intent not found for paid Checkout Session");
  }

  await getStripe().refunds.create(
    {
      payment_intent: paymentIntent,
    },
    {
      idempotencyKey: `booking-recovery-refund-${session.id}`,
    }
  );
};

export const createCheckoutSession = async (
  bookingReference: string,
  totalAmount: number,
  customerEmail: string,
  cancellationToken: string
) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const cancellationFragment = `#cancellationToken=${encodeURIComponent(cancellationToken)}`;

  return getStripe().checkout.sessions.create({
    mode: "payment",
    customer_email: customerEmail,
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
    success_url: `${frontendUrl}/booking/${bookingReference}?payment=success${cancellationFragment}`,
    cancel_url: `${frontendUrl}/booking/${bookingReference}?payment=cancelled`,
  });
};

const reconcilePaidCheckoutSession = async (
  session: Stripe.Checkout.Session
) => {
  const bookingReference = session.metadata?.bookingReference;

  if (session.payment_status !== "paid" || !bookingReference) {
    return;
  }

  const booking = await getBookingStatusFromTheatre(bookingReference);

  if (booking.booking_status === "CONFIRMED") {
    await sendBookingReceipt(
      bookingReference,
      session.id,
      session.customer_details?.email || session.customer_email,
      session.amount_total
    );
    return;
  }

  if (booking.booking_status === "CANCELLED") {
    await refundCheckoutSession(session);
    return;
  }

  if (booking.booking_status === "CANCELLATION_PENDING") {
    await refundCheckoutSession(session);
    await completeBookingCancellationAtTheatre(bookingReference);
    return;
  }

  if (booking.booking_status !== "PENDING") {
    throw new Error(`Cannot reconcile paid booking in ${booking.booking_status} state`);
  }

  try {
    await confirmBookingAtTheatre(bookingReference);
  } catch (error) {
    const latestBooking = await getBookingStatusFromTheatre(bookingReference);

    if (latestBooking.booking_status === "CONFIRMED") {
      await sendBookingReceipt(
        bookingReference,
        session.id,
        session.customer_details?.email || session.customer_email,
        session.amount_total
      );
      return;
    }

    if (latestBooking.booking_status === "CANCELLED") {
      await refundCheckoutSession(session);
      return;
    }

    if (latestBooking.booking_status === "CANCELLATION_PENDING") {
      await refundCheckoutSession(session);
      await completeBookingCancellationAtTheatre(bookingReference);
      return;
    }

    const message = error instanceof Error ? error.message : String(error);
    const seatCannotBeConfirmed = [
      "Seat lock has expired",
      "Seat is not locked",
      "Seat is already booked",
      "Show seat not found",
    ].some((reason) => message.includes(reason));

    if (!seatCannotBeConfirmed) {
      throw error;
    }

    await cancelBookingAtTheatre(bookingReference);
    await refundCheckoutSession(session);
    await completeBookingCancellationAtTheatre(bookingReference);
    return;
  }

  await sendBookingReceipt(
    bookingReference,
    session.id,
    session.customer_details?.email || session.customer_email,
    session.amount_total
  );
};

export const reconcilePaidBookingPayment = async (
  bookingReference: string
) => {
  const booking = await getBookingStatusFromTheatre(bookingReference);

  if (!booking.stripe_checkout_session_id) {
    return;
  }

  const session = await getStripe().checkout.sessions.retrieve(
    booking.stripe_checkout_session_id
  );

  if (session.payment_status === "paid") {
    await reconcilePaidCheckoutSession(session);
  }
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

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return;
  }

  await reconcilePaidCheckoutSession(event.data.object);
};

export const refundBookingPayment = async (checkoutSessionId: string) => {
  const stripe = getStripe();
  let session = await stripe.checkout.sessions.retrieve(checkoutSessionId);

  if (session.status === "open") {
    session = await stripe.checkout.sessions.expire(checkoutSessionId);
  }

  if (session.payment_status !== "paid") {
    return false;
  }

  await refundCheckoutSession(session);
  return true;
};