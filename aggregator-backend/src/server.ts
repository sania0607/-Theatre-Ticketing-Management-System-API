import express from "express";
import cors from "cors";
import aggregatorRoutes from "./routes/aggregator.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/aggregator", aggregatorRoutes);

app.listen(4000, () => {
  console.log("Aggregator backend running on http://localhost:4000");
});