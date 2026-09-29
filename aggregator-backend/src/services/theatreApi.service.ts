import crypto from "crypto";
import fs from "fs";
import path from "path";

const THEATRE_API_URL = "http://localhost:3000";
const CLIENT_CODE = "TEST001";

const privateKey = fs.readFileSync(
  path.join(process.cwd(), "keys", "client-private.pem"),
  "utf8"
);

const makeSignature = (
  method: string,
  url: string,
  body: object = {}
) => {
  const timestamp = Date.now().toString();
  const bodyString = JSON.stringify(body);

  const data = [
    CLIENT_CODE,
    timestamp,
    method,
    url,
    bodyString,
  ].join("|");

  const signer = crypto.createSign("RSA-SHA256");

  signer.update(data);
  signer.end();

  const signature = signer.sign(privateKey, "base64");

  return {
    timestamp,
    signature,
  };
};


export const getMoviesFromTheatre = async () => {
  const method = "GET";
  const url = "/movies";
  const body = {};

  const { timestamp, signature } =
    makeSignature(method, url, body);

  const response = await fetch(
    `${THEATRE_API_URL}${url}`,
    {
      method,
      headers: {
        "x-client-code": CLIENT_CODE,
        "x-timestamp": timestamp,
        "x-signature": signature,
      },
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};


export const getShowsFromTheatre = async (movieId?: number) => {
  const method = "GET";
  const url = movieId ? `/shows?movie_id=${movieId}` : "/shows";
  const body = {};

  const { timestamp, signature } =
    makeSignature(method, url, body);

  const response = await fetch(
    `${THEATRE_API_URL}${url}`,
    {
      method,
      headers: {
        "x-client-code": CLIENT_CODE,
        "x-timestamp": timestamp,
        "x-signature": signature,
      },
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};


export const getShowSeatsFromTheatre = async (
  showId: number
) => {
  const method = "GET";
  const url = `/show-seats?show_id=${showId}`;
  const body = {};

  const { timestamp, signature } =
    makeSignature(method, url, body);

  const response = await fetch(
    `${THEATRE_API_URL}${url}`,
    {
      method,
      headers: {
        "x-client-code": CLIENT_CODE,
        "x-timestamp": timestamp,
        "x-signature": signature,
      },
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};


export const lockSeatAtTheatre = async (
  showSeatIds: number | number[],
  aggregatorName: string
) => {
  const method = "POST";
  const firstShowSeatId = Array.isArray(showSeatIds)
    ? showSeatIds[0]
    : showSeatIds;
  const url = `/show-seats/${firstShowSeatId}/lock`;

  const body = {
    aggregatorName,
    showSeatIds: Array.isArray(showSeatIds) ? showSeatIds : [showSeatIds],
  };

  const { timestamp, signature } =
    makeSignature(method, url, body);

  const response = await fetch(
    `${THEATRE_API_URL}${url}`,
    {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-client-code": CLIENT_CODE,
        "x-timestamp": timestamp,
        "x-signature": signature,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export const releaseSeatAtTheatre = async (showSeatIds: number | number[]) => {
  for (const showSeatId of Array.isArray(showSeatIds) ? showSeatIds : [showSeatIds]) {
  const method = "POST";
  const url = `/show-seats/${showSeatId}/release`;
  const body = {};

  const { timestamp, signature } = makeSignature(method, url, body);

  const response = await fetch(`${THEATRE_API_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-client-code": CLIENT_CODE,
      "x-timestamp": timestamp,
      "x-signature": signature,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
  }
};


export const confirmBookingAtTheatre = async (
  bookingReference: string
) => {
  const method = "POST";
  const url =
    `/bookings/${bookingReference}/confirm`;

  const body = {};

  const { timestamp, signature } =
    makeSignature(method, url, body);

  const response = await fetch(
    `${THEATRE_API_URL}${url}`,
    {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-client-code": CLIENT_CODE,
        "x-timestamp": timestamp,
        "x-signature": signature,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export const getBookingStatusFromTheatre = async (
  bookingReference: string
) => {
  const method = "GET";
  const url = `/bookings/${bookingReference}/status`;
  const body = {};

  const { timestamp, signature } = makeSignature(method, url, body);

  const response = await fetch(`${THEATRE_API_URL}${url}`, {
    method,
    headers: {
      "x-client-code": CLIENT_CODE,
      "x-timestamp": timestamp,
      "x-signature": signature,
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export const cancelBookingAtTheatre = async (bookingReference: string) => {
  const method = "POST";
  const url = `/bookings/${bookingReference}/cancel`;
  const body = {};
  const { timestamp, signature } = makeSignature(method, url, body);

  const response = await fetch(`${THEATRE_API_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-client-code": CLIENT_CODE,
      "x-timestamp": timestamp,
      "x-signature": signature,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export const saveCheckoutSessionAtTheatre = async (
  bookingReference: string,
  checkoutSessionId: string
) => {
  const method = "POST";
  const url = `/bookings/${bookingReference}/checkout-session`;
  const body = { checkoutSessionId };
  const { timestamp, signature } = makeSignature(method, url, body);

  const response = await fetch(`${THEATRE_API_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-client-code": CLIENT_CODE,
      "x-timestamp": timestamp,
      "x-signature": signature,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export const completeBookingCancellationAtTheatre = async (
  bookingReference: string
) => {
  const method = "POST";
  const url = `/bookings/${bookingReference}/complete-cancel`;
  const body = {};
  const { timestamp, signature } = makeSignature(method, url, body);

  const response = await fetch(`${THEATRE_API_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-client-code": CLIENT_CODE,
      "x-timestamp": timestamp,
      "x-signature": signature,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};