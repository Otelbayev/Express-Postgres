import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Send, X, CheckSquare, Square } from "lucide-react";
import { useState, useEffect } from "react";

const Modal = ({
  isModalOpen,
  setIsModalOpen,
  data,
  getData,
  MY_TELEGRAM_ID,
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Modal ochilganda barcha userlarni avtomatik tanlash
  useEffect(() => {
    if (isModalOpen && data?.allUsers) {
      const allIds = data.allUsers.map((u) => u.id);
      setSelectedUsers(allIds);
    }
  }, [isModalOpen, data?.allUsers]);

  function formatNumber(value) {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function handleAmountChange(e) {
    const raw = e.target.value.replace(/\D/g, "");
    setAmount(formatNumber(raw));
  }

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  // Hammasini tanlash yoki bekor qilish logikasi (Qo'shimcha qulaylik)
  const toggleAll = () => {
    if (selectedUsers.length === data.allUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(data.allUsers.map((u) => u.id));
    }
  };

  const handleSubmit = async () => {
    if (!description || !amount || selectedUsers.length === 0) {
      alert(
        "Iltimos, barcha maydonlarni to'ldiring va kamida bitta foydalanuvchini tanlang!",
      );
      return;
    }

    setLoading(true);
    try {
      const payer = data.allUsers.find((u) => u.telegram_id === MY_TELEGRAM_ID);
      const cleanAmount = amount.replace(/\./g, "");

      await axios.post(`${import.meta.env.VITE_BASE_API_URL}/expense/create`, {
        description,
        amount: parseFloat(cleanAmount),
        payer_id: payer?.id,
        split_with_ids: selectedUsers,
      });

      // Tozalash
      setIsModalOpen(false);
      setDescription("");
      setAmount("");
      setSelectedUsers([]);
      getData();
    } catch (error) {
      console.error(error);
      alert("Xarajatni saqlashda xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Plus Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 right-6 w-14 h-14 bg-indigo-600 text-white rounded-2xl shadow-2xl shadow-indigo-300 flex items-center justify-center z-20"
      >
        <Plus size={28} />
      </motion.button>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-30"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 z-40 shadow-2xl overflow-y-auto max-h-[92vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  Xarajat qo'shish
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-slate-100 rounded-full text-slate-500"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5">
                {/* Tavsif */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">
                    Nima uchun? (Tavsif)
                  </label>
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-medium transition-all"
                    placeholder="Masalan: Bozorlik yoki Tushlik"
                  />
                </div>

                {/* Summa */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">
                    Summa (so'm)
                  </label>
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    inputMode="numeric"
                    className="w-full p-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-black text-2xl text-indigo-600 transition-all"
                    placeholder="0"
                  />
                </div>

                {/* Split Selection */}
                <div>
                  <div className="flex justify-between items-center mb-3 px-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Kimlar uchun? ({selectedUsers.length} kishi)
                    </label>
                    <button
                      onClick={toggleAll}
                      className="text-[10px] font-extrabold text-indigo-600 uppercase"
                    >
                      {selectedUsers.length === data?.allUsers.length
                        ? "Hech kim"
                        : "Hammasi"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {data?.allUsers.map((user) => {
                      const isSelected = selectedUsers.includes(user.id);
                      return (
                        <button
                          key={user.id}
                          onClick={() => toggleUser(user.id)}
                          className={`p-3 rounded-2xl border text-sm font-bold transition-all flex items-center gap-2 ${
                            isSelected
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                              : "bg-white border-slate-200 text-slate-600"
                          }`}
                        >
                          {isSelected ? (
                            <CheckSquare size={16} />
                          ) : (
                            <Square size={16} className="text-slate-300" />
                          )}
                          <span className="truncate">
                            {user.full_name.split(" ")[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  disabled={loading}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  className={`w-full py-4 rounded-3xl font-extrabold text-lg mt-4 flex items-center justify-center gap-3 shadow-xl transition-all ${
                    loading
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-indigo-600 text-white shadow-indigo-200"
                  }`}
                >
                  {loading ? (
                    "Yuborilmoqda..."
                  ) : (
                    <>
                      <Send size={20} /> Yuborish
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Modal;
