import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import pool from "./config/db.js";
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use("/api", routes);

app.get("/health", (req, res) => {
  res.json({ message: "Healthy project" });
});

app.listen(PORT, async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected");
  } catch (e) {
    console.log("Database error:", err);
  }

  console.log("Server running on " + PORT);
});
