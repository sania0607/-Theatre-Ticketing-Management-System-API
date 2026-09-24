const API_BASE_URL = "http://localhost:4000";

export interface Movie {
  id: number;
  title: string;
  genre: string;
  language: string;
  duration: number;
  release_date: string;
}

export const getMovies = async (): Promise<Movie[]> => {
  const response = await fetch(`${API_BASE_URL}/aggregator/movies`);

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.status}`);
  }

  return response.json();
};
export interface Show {
  id: number;
  movie_id: number;
  screen_id: number;
  show_date: string;
  start_time: string;
  end_time: string;
  ticket_price: string;
}

export const getShows = async (movieId: number): Promise<Show[]> => {
  const response = await fetch(
    `${API_BASE_URL}/aggregator/shows?movie_id=${movieId}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch shows: ${response.status}`);
  }

  return response.json();
};


export interface ShowSeat {
  id: number;
  show_id: number;
  seat_id: number;
  status: "AVAILABLE" | "LOCKED" | "BOOKED";
  locked_until: string | null;
}

export const getShowSeats = async (
  showId: number
): Promise<ShowSeat[]> => {
  const response = await fetch(
    `${API_BASE_URL}/aggregator/show-seats?show_id=${showId}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch seats: ${response.status}`
    );
  }

  return response.json();
};

export const confirmBooking = async (
  bookingReference: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/aggregator/bookings/${bookingReference}/confirm`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to confirm booking"
    );
  }

  return data;
};

export const getBookingStatus = async (bookingReference: string) => {
  const response = await fetch(
    `${API_BASE_URL}/aggregator/bookings/${bookingReference}/status`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch booking status");
  }

  return response.json();
};

export const cancelBooking = async (bookingReference: string) => {
  const response = await fetch(
    `${API_BASE_URL}/aggregator/bookings/${bookingReference}/cancel`,
    { method: "POST" }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to cancel booking");
  }

  return data;
};


