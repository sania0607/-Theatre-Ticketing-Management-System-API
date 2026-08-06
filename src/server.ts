import app from "./app";
import { pool } from "./config/database";

const PORT = process.env.PORT || 3000;

pool.connect()
  .then(() => {
    console.log("Database Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database Connection Failed:", err);
  });