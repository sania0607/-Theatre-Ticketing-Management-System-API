import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMovies } from "../services/api";
import type { Movie } from "../services/api";
import "../App.css";

function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getMovies()
      .then((data) => {
        setMovies(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">

        <div className="header-left">

          <div className="logo">
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


      {/* HERO */}
      <section className="hero">

        <div className="hero-content">

          <p className="hero-small">
            WELCOME TO MOVIEBOX
          </p>

          <h1>
            Movies you'll
            <br />
            <span>love to watch.</span>
          </h1>

          <p className="hero-description">
            Discover movies, check showtimes and book your
            seats in just a few clicks.
          </p>

          <button
            className="hero-btn"
            onClick={() =>
              document
                .getElementById("movies")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore Movies →
          </button>

        </div>

      </section>


      {/* MOVIES */}
      <main className="content" id="movies">

        <div className="section-header">

          <div>
            <h2>Recommended Movies</h2>
            <p>Popular movies near you</p>
          </div>

          <button className="see-all">
            See All →
          </button>

        </div>


        {/* LOADING */}
        {loading && (
          <div className="loading">
            Loading movies...
          </div>
        )}


        {/* EMPTY */}
        {!loading && movies.length === 0 && (
          <div className="empty">
            No movies available right now.
          </div>
        )}


        {/* MOVIE GRID */}
        {!loading && movies.length > 0 && (

          <div className="movie-grid">

            {movies.map((movie) => (

              <div
                className="movie-card"
                key={movie.id}
              >

                {/* POSTER */}
                <div className="poster">

                  <div className="poster-overlay">

                    <span className="play">
                      ▶
                    </span>

                  </div>

                </div>


                {/* MOVIE INFO */}
                <div className="movie-info">

                  <h3>
                    {movie.title.trim()}
                  </h3>

                  <p className="movie-meta">
                    {movie.genre} • {movie.language}
                  </p>

                  <p className="duration">
                    ⏱ {movie.duration} min
                  </p>


                  {/* BOOK NOW */}
                  <button
                    className="book-btn"
                    onClick={() =>
                      navigate(`/shows/${movie.id}`)
                    }
                  >
                    Book Now
                  </button>

                </div>

              </div>

            ))}

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

export default Home;

