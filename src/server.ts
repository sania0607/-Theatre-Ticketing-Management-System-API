import express from "express";
import { pool } from "./config/database";
import theatreRoutes from "./routes/theatre.routes";

const app = express();

app.use(express.json());
app.use(theatreRoutes);

pool.connect()
    .then(() => {
        console.log("Database Connected");
    })
    .catch(err => {
        console.error(err);
    });

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
app.get("/", (req, res) => {
  res.send("Server is running!");
});
