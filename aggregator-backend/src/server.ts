import express from "express";
import cors from "cors";
import aggregatorRoutes from "./routes/aggregator.routes";
import { handleStripeWebhook } from "./services/stripe.service";

const app = express();

app.use(cors());
app.post(
  "/aggregator/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      await handleStripeWebhook(req.body, req.headers["stripe-signature"]);
      res.json({ received: true });
    } catch (error) {
      console.error("STRIPE WEBHOOK ERROR:", error);
      res.status(400).json({ message: "Invalid Stripe webhook" });
    }
  }
);
app.use(express.json());

app.use("/aggregator", aggregatorRoutes);

app.listen(4000, () => {
  console.log("Aggregator backend running on http://localhost:4000");
});