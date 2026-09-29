import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getShowSeats, getShows } from "../services/api";
import type { Show, ShowSeat } from "../services/api";

import "../App.css";

function Seats() {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [seats, setSeats] = useState<ShowSeat[]>([]);
  const [show, setShow] = useState<Show | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<ShowSeat[]>([]);
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [locking, setLocking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!showId) return;

    Promise.all([getShowSeats(Number(showId)), getShows()])
      .then(([data, shows]) => {
        const selectedShow = shows.find(
          (item) => item.id === Number(showId)
        );

        if (!selectedShow || !Number.isFinite(Number(selectedShow.ticket_price)) || Number(selectedShow.ticket_price) <= 0) {
          throw new Error("This show is no longer available for booking.");
        }

        setShow(selectedShow);
        setSeats(
          data.filter(
            (seat) => seat.show_id === Number(showId)
          )
        );
      })
      .catch((error) => {
        console.error(error);
        setError(error.message || "Failed to load seats.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showId]);

  const handleSeatClick = (seat: ShowSeat) => {
    if (seat.status !== "AVAILABLE") {
      return;
    }

    setSelectedSeats((currentSeats) =>
      currentSeats.some((currentSeat) => currentSeat.id === seat.id)
        ? currentSeats.filter((currentSeat) => currentSeat.id !== seat.id)
        : [...currentSeats, seat]
    );
    setError("");
  };

  const handleLockSeat = async () => {
    if (selectedSeats.length === 0) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      setError("Enter a valid email address for your booking receipt.");
      return;
    }

    setLocking(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:4000/aggregator/show-seats/${selectedSeats[0].id}/lock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            aggregatorName: "MovieBox",
            showSeatIds: selectedSeats.map((seat) => seat.id),
            customerEmail: customerEmail.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to lock seat"
        );
      }

      if (!data.checkoutUrl) {
        throw new Error("Payment checkout is unavailable");
      }

      if (!data.cancellationToken) {
        throw new Error("Booking cancellation token was not returned");
      }

      sessionStorage.setItem(
        `booking-cancellation:${data.bookingReference}`,
        data.cancellationToken
      );

      window.location.assign(data.checkoutUrl);

    } catch (error: unknown) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "Failed to lock seat."
      );
    } finally {
      setLocking(false);
    }
  };

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">

        <div className="header-left">

          <div
            className="logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <span>movie</span>box
          </div>

          <div className="location">
            📍 Meerut
            <span>⌄</span>
          </div>

        </div>

        <div className="search">
          🔍
          <input
            type="text"
            placeholder="Search for Movies, Events, Plays, Sports and Activities"
          />
        </div>

        <button className="login-btn">
          Sign in
        </button>

      </header>


      {/* NAVIGATION */}
      <nav className="nav">

        <div className="nav-left">
          <span>Movies</span>
          <span>Stream</span>
          <span>Events</span>
          <span>Plays</span>
          <span>Sports</span>
          <span>Activities</span>
        </div>

        <div className="nav-right">
          <span>ListYourShow</span>
          <span>Corporates</span>
          <span>Offers</span>
        </div>

      </nav>


      {/* SEATS */}
      <main className="content seats-page">

        <button
          className="back-btn"
          onClick={() =>
            navigate(`/shows/${showId}`)
          }
        >
          ← Back to Shows
        </button>


        <div className="section-header">

          <div>
            <h2>Select Your Seats</h2>

            <p>
              Choose an available seat
            </p>
          </div>

        </div>


        {loading && (
          <div className="loading">
            Loading seats...
          </div>
        )}


        {error && (
          <div className="empty">
            {error}
          </div>
        )}


        {!loading && !error && (

          <>

            {/* SCREEN */}
            <div className="screen">
              SCREEN
            </div>


            {/* SEAT GRID */}
            <div className="seat-grid">

              {seats.map((seat) => (

                <button
                  key={seat.id}
                  className={`seat ${
                    seat.status.toLowerCase()
                  } ${
                    selectedSeats.some((selected) => selected.id === seat.id)
                      ? "selected"
                      : ""
                  }`}
                  disabled={
                    seat.status !== "AVAILABLE"
                  }
                  onClick={() =>
                    handleSeatClick(seat)
                  }
                >
                  {seat.seat_id}
                </button>

              ))}

            </div>


            {/* LEGEND */}
            <div className="seat-legend">

              <span>
                <i className="legend available"></i>
                Available
              </span>

              <span>
                <i className="legend selected"></i>
                Selected
              </span>

              <span>
                <i className="legend booked"></i>
                Booked
              </span>

              <span>
                <i className="legend locked"></i>
                Locked
              </span>

            </div>


            {/* SELECTED SEAT */}
            {selectedSeats.length > 0 && (

              <div className="booking-summary">

                <label className="booking-email-field">
                  Receipt email
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={customerEmail}
                    onChange={(event) => setCustomerEmail(event.target.value)}
                    required
                  />
                </label>

                <div>
                  <p>Selected Seat</p>

                  <h3>
                    {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""} selected
                  </h3>
                </div>

                <div>
                  <p>Price</p>

                  <h3>
                    ₹{selectedSeats.length * Number(show?.ticket_price ?? 0)}
                  </h3>
                </div>

                <button
                  className="book-btn"
                  onClick={handleLockSeat}
                  disabled={locking || !show || !customerEmail.trim()}
                >
                  {locking
                    ? "Locking..."
                    : "Continue →"}
                </button>

              </div>

            )}

          </>

        )}

      </main>


      {/* FOOTER */}
      <footer>

        <div className="footer-logo">
          moviebox
        </div>

        <p>
          A demo aggregator platform powered by
          Theatre Ticketing API
        </p>

      </footer>

    </div>
  );
}

export default Seats;

