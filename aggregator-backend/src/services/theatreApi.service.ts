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


export const getShowsFromTheatre = async () => {
  const method = "GET";
  const url = "/shows";
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
  showSeatId: number,
  aggregatorName: string,
  totalAmount: number
) => {
  const method = "POST";
  const url = `/show-seats/${showSeatId}/lock`;

  const body = {
    aggregatorName,
    totalAmount,
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