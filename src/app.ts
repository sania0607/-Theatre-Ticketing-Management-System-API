import express from "express";
import theatreRoutes from "./routes/theatre.routes";

const app = express();

app.use(express.json());

// Register routes
app.use(theatreRoutes);

export default app;