import express from "express";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import routes from "./routes/index.js";
import pool from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const TOKEN = "8106962461:AAG-lKupXm18flQpx2LwybzZM7_PP9vuieQ";

const app = express();

const bot = new TelegramBot(TOKEN, { polling: true });

app.set("bot", bot);
bot.on("message", async (msg) => {
  const from = msg.from;

  if (!from.is_bot) {
    try {
      const fullName =
        `${from.first_name || ""} ${from.last_name || ""}`.trim();

      const userExists = await pool.query(
        "SELECT id FROM users WHERE telegram_id = $1",
        [from.id],
      );

      if (userExists.rowCount === 0) {
        await pool.query(
          `INSERT INTO users (telegram_id, username, full_name) 
         VALUES ($1, $2, $3)
         ON CONFLICT (telegram_id)
         DO UPDATE 
         SET username = EXCLUDED.username,
             full_name = EXCLUDED.full_name`,
          [from.id, from.username || null, fullName || null],
        );
      }

      console.log(`User saqlandi yoki yangilandi: ${fullName}`);
    } catch (err) {
      console.error(err);
    }
  }
});

app.use(express.json());
app.use("/api", routes);

app.get("/health", (req, res) => {
  res.json({ message: "Healthy project" });
});

app.listen(PORT, async () => {
  try {
    await pool
      .query("SELECT current_database()")
      .then((res) =>
        console.log("Connected to DB:", res.rows[0].current_database),
      );
    console.log("Database connected");
  } catch (e) {
    console.log("Database error:", e);
  }
  console.log("Server running on " + PORT);
});
