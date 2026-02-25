import express from "express";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import routes from "./routes/index.js";
import pool from "./config/db.js";
import cors from "cors";

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

const mainMenuKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: "📊 Balansni ko'rish" }, { text: "ℹ️ Ma'lumot" }],
      [{ text: "💳 Karta raqamim" }],
    ],
    resize_keyboard: true, // Tugmalarni kichraytirish (chiroyli ko'rinishi uchun)
    one_time_keyboard: false, // Har doim turishi uchun
  },
};

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const from = msg.from;

  const welcomeMsg = `
👋 *Salom, ${from.first_name}!*

Kvartira hisob-kitob botiga xush kelibsiz. 
Ushbu bot orqali xarajatlarni adolatli taqsimlashingiz va kimdan qancha qarz borligini ko'rishingiz mumkin.

👇 Quyidagi tugmalardan foydalaning:`;

  bot.sendMessage(chatId, welcomeMsg, {
    parse_mode: "Markdown",
    ...mainMenuKeyboard,
  });
});

bot.onText(/\/info|ℹ️ Ma'lumot/, (msg) => {
  const infoMsg = `
📖 *Botdan foydalanish bo'yicha qo'llanma:*

1️⃣ *Guruhga qo'shish:* Botni kvartira guruhingizga qo'shing va admin qiling.
2️⃣ *Ro'yxatdan o'tish:* Guruhda bir marta xabar yozsangiz, bot sizni taniydi.
3️⃣ *Balans:* "📊 Balansni ko'rish" tugmasini bosing.
4️⃣ *Tasdiqlash:* Pulni olganingizdan so'ng, bot yuborgan xabardagi "Tasdiqlash" tugmasini bosing.

Savollar bo'lsa, @admin ga murojaat qiling.`;

  bot.sendMessage(msg.chat.id, infoMsg, { parse_mode: "Markdown" });
});

bot.on("message", async (msg) => {
  if (msg.text === "📊 Balansni ko'rish") {
    bot.onText(/\/balans/, async (msg) => {
      const telegram_id = msg.from.id;
      const chatId = msg.chat.id;
    });
  }
});

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());
app.use("/api", routes);

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
