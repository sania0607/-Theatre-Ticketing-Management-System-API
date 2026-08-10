import express from "express";
import theatreRoutes from "./routes/theatre.routes";
import screenRoutes from "./routes/screen.routes";
import movieRoutes from "./routes/movie.routes";
import showRoutes from "./routes/show.routes";
import seatRoutes from "./routes/seat.routes";
import showseatRoutes from "./routes/showseat.routes";
import bookingRoutes from "./routes/booking.routes";
import bookingSeatRoutes from "./routes/bookingseat.routes";
import staffRoutes from "./routes/staff.routes";
const app = express();

app.use(express.json());

// Register routes
app.use(theatreRoutes);
app.use(screenRoutes);
app.use(movieRoutes);
app.use(showRoutes);
app.use(seatRoutes);
app.use(showseatRoutes);
app.use(bookingRoutes);
app.use(bookingSeatRoutes);
app.use(staffRoutes);
// Health Check
app.get("/", (req, res) => {
  res.send("Server is running!");
});


export default app;
