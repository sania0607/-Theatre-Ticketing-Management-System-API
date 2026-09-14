import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getShows } from "../services/api";
import type { Show } from "../services/api";
import "../App.css";

function Shows() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieId) return;

    getShows(Number(movieId))
      .then((data) => {
        setShows(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [movieId]);

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


      {/* SHOWS CONTENT */}
      <main className="content shows-page">

        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Movies
        </button>

        <div className="section-header">

          <div>
            <h2>Select a Show</h2>
            <p>
              Choose a showtime to continue booking
            </p>
          </div>

        </div>


        {loading && (
          <div className="loading">
            Loading showtimes...
          </div>
        )}


        {!loading && shows.length === 0 && (
          <div className="empty">
            No shows available for this movie.
          </div>
        )}


        {!loading && shows.length > 0 && (

          <div className="shows-list">

            {shows.map((show) => {

              const startTime = new Date(
                show.start_time
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              const endTime = new Date(
                show.end_time
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              const showDate = new Date(
                show.show_date
              ).toLocaleDateString([], {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });

              return (

                <div
                  className="show-card"
                  key={show.id}
                >

                  <div className="show-info">

                    <h3>
                      Screen {show.screen_id}
                    </h3>

                    <p>
                      {showDate}
                    </p>

                  </div>


                  <div className="show-time">

                    <span>
                      {startTime}
                    </span>

                    <small>
                      - {endTime}
                    </small>

                  </div>


                  <div className="show-price">

                    ₹{show.ticket_price}

                  </div>


                  <button
                    className="book-btn"
                    onClick={() =>
                      navigate(`/seats/${show.id}`)
                    }
                  >
                    Select Seats
                  </button>

                </div>

              );

            })}

          </div>

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

export default Shows;
