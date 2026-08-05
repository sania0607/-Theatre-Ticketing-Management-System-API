import express from "express";
import { pool } from "./config/database";

const app = express();

app.use(express.json());

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