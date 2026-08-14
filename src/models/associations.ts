import Theatre from "./theatre.model";
import Screen from "./screen.model";
import Movie from "./movie.model";
import Show from "./show.model";

// Theatre → Screen
Theatre.hasMany(Screen, {
  foreignKey: "theatre_id",
  as: "screens",
});

Screen.belongsTo(Theatre, {
  foreignKey: "theatre_id",
  as: "theatre",
});

// Movie → Show
Movie.hasMany(Show, {
  foreignKey: "movie_id",
  as: "shows",
});

Show.belongsTo(Movie, {
  foreignKey: "movie_id",
  as: "movie",
});

// Screen → Show
Screen.hasMany(Show, {
  foreignKey: "screen_id",
  as: "shows",
});

Show.belongsTo(Screen, {
  foreignKey: "screen_id",
  as: "screen",
});