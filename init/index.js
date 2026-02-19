import express from "express";
import cors from "cors";
import { ENV } from "./src/config/env.js";
import { pool } from "./src/config/db.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "none" });
});

const startServer = async () => {
  try {
    await pool.query("SELECT 1");

    console.log("Database connected");

    app.listen(ENV.PORT, () => {
      console.log("Server is running on " + ENV.PORT);
    });
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
};

startServer();
