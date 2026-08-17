import Theatre from "./theatre.model";
import Screen from "./screen.model";
import Movie from "./movie.model";
import Show from "./show.model";
import Seat from "./seat.model";
import ShowSeat from "./showseat.model";
import Booking from "./booking.model";
import BookingSeat from "./bookingseat.model";

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

Screen.hasMany(Seat, {
  foreignKey: "screen_id",
  as: "seats",
});

Seat.belongsTo(Screen, {
  foreignKey: "screen_id",
  as: "screen",
});


Show.hasMany(ShowSeat, {
  foreignKey: "show_id",
  as: "showSeats",
});

ShowSeat.belongsTo(Show, {
  foreignKey: "show_id",
  as: "show",
});

Seat.hasMany(ShowSeat, {
  foreignKey: "seat_id",
  as: "showSeats",
});

ShowSeat.belongsTo(Seat, {
  foreignKey: "seat_id",
  as: "seat",
});

Show.hasMany(Booking, {
  foreignKey: "show_id",
  as: "bookings",
});

Booking.belongsTo(Show, {
  foreignKey: "show_id",
  as: "show",
});

Booking.hasMany(BookingSeat, {
  foreignKey: "booking_id",
  as: "bookingSeats",
});

BookingSeat.belongsTo(Booking, {
  foreignKey: "booking_id",
  as: "booking",
});

ShowSeat.hasMany(BookingSeat, {
  foreignKey: "show_seat_id",
  as: "bookingSeats",
});

BookingSeat.belongsTo(ShowSeat, {
  foreignKey: "show_seat_id",
  as: "showSeat",
});