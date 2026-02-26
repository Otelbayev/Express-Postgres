import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Copy, CreditCard, User, Users } from "lucide-react";
import { useHome } from "../context/home-context";

export default function Settings() {
  const { mydata: user, getData, data } = useHome();

  const [cardNumber, setCardNumber] = useState("");
  const [loading, setLoading] = useState(false);

  function formatCard(card) {
    if (!card) return null;

    return card
      ?.replace(/\D/g, "")
      ?.slice(0, 16)
      ?.replace(/(.{4})/g, "$1 ")
      ?.trim();
  }

  function handleCopy(card) {
    if (!card) return;
    navigator.clipboard.writeText(card);
    alert("Karta raqami copy qilindi ✅");
  }

  function handleChange(e) {
    const formatted = formatCard(e.target.value);
    setCardNumber(formatted);
  }

  async function handleUpdate() {
    const cleanCard = cardNumber.replace(/\s/g, "");

    if (cleanCard.length !== 16) {
      alert("Karta raqami 16 ta bo‘lishi kerak");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/expense/update-card-number`,
        {
          user_id: user.id,
          card_number: cleanCard,
        },
      );
      getData();
      alert("Karta raqami yangilandi ✅");
    } catch (error) {
      alert("Xatolik yuz berdi ❌");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-5  max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-md p-5 space-y-6"
      >
        {/* USER INFO */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
            <User size={24} />
          </div>
          <div>
            <p className="font-semibold">{user?.full_name}</p>
            <p className="text-sm text-slate-500">@{user?.username}</p>
            <p className="text-xs text-slate-400">
              Telegram ID: {user?.telegram_id}
            </p>
          </div>
        </div>

        {/* CARD NUMBER */}
        {user?.card_number && (
          <div className="bg-slate-50 px-4 py-3 rounded-xl">
            <p className="text-md text-slate-600 font-medium">
              {formatCard(user.card_number)}
            </p>
          </div>
        )}

        {/* CARD INPUT */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
            <CreditCard size={16} />
            Karta raqami
          </label>

          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            value={cardNumber}
            onChange={handleChange}
            placeholder="8600 1234 5678 9012"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>

        {/* UPDATE BUTTON */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 space-y-4"
      >
        <div className="flex items-center gap-2">
          <Users size={18} />
          <h2 className="font-semibold text-lg">Barcha foydalanuvchilar</h2>
        </div>

        {data?.allUsers?.map((item, idx) => (
          <div
            key={item?.id ?? idx}
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3"
          >
            {/* USER INFO */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold">
                {item?.full_name?.[0] ?? "U"}
              </div>
              <div>
                <p className="font-medium text-sm">
                  {item?.full_name ?? "No name"}
                </p>
                <p className="text-xs text-slate-400">
                  @{item?.username ?? "no_username"}
                </p>
              </div>
            </div>

            {/* CARD NUMBER */}
            <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl">
              <span className="text-sm font-mono text-slate-700">
                {item?.card_number
                  ? formatCard(item?.card_number)
                  : "Kiritilmagan"}
              </span>

              {item?.card_number && (
                <button
                  onClick={() => handleCopy(item?.card_number)}
                  className="p-2 hover:bg-slate-200 rounded-lg transition"
                >
                  <Copy size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
