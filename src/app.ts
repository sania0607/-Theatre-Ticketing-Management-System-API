import express from "express";
import theatreRoutes from "./routes/theatre.routes";
import screenRoutes from "./routes/screen.routes";
import movieRoutes from "./routes/movie.routes";

const app = express();

app.use(express.json());

// Register routes
app.use(theatreRoutes);
app.use(screenRoutes);
app.use(movieRoutes);

export default app;