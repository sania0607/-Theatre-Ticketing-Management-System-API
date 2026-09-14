import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getShowSeats } from "../services/api";
import type { ShowSeat } from "../services/api";

import "../App.css";

function Seats() {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [seats, setSeats] = useState<ShowSeat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<ShowSeat | null>(null);
  const [loading, setLoading] = useState(true);
  const [locking, setLocking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!showId) return;

    getShowSeats(Number(showId))
      .then((data) => {
        setSeats(
          data.filter(
            (seat) => seat.show_id === Number(showId)
          )
        );
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to load seats.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showId]);

  const handleSeatClick = (seat: ShowSeat) => {
    if (seat.status !== "AVAILABLE") {
      return;
    }

    setSelectedSeat(seat);
    setError("");
  };

  const handleLockSeat = async () => {
    if (!selectedSeat) return;

    setLocking(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:4000/aggregator/show-seats/${selectedSeat.id}/lock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            aggregatorName: "MovieBox",
            totalAmount: 350,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to lock seat"
        );
      }

      navigate(
        `/booking/${data.bookingReference}`
      );

    } catch (error: any) {
      console.error(error);
      setError(
        error.message || "Failed to lock seat."
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
                    selectedSeat?.id === seat.id
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
            {selectedSeat && (

              <div className="booking-summary">

                <div>
                  <p>Selected Seat</p>

                  <h3>
                    Seat {selectedSeat.seat_id}
                  </h3>
                </div>

                <div>
                  <p>Price</p>

                  <h3>
                    ₹350
                  </h3>
                </div>

                <button
                  className="book-btn"
                  onClick={handleLockSeat}
                  disabled={locking}
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

