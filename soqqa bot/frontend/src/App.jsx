import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  CheckCircle2,
  User,
  Receipt,
  Send,
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const MY_TELEGRAM_ID = "1105787891";
  // const MY_TELEGRAM_ID = "896307244";

  const getData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/expense/balance/${MY_TELEGRAM_ID}`,
      );
      setData(res.data);
    } catch (error) {
      console.error("Xatolik yuz berdi:", error.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSubmit = async () => {
    if (!description || !amount || selectedUsers.length === 0) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    try {
      const payer = data.allUsers.find((u) => u.telegram_id === MY_TELEGRAM_ID);
      await axios.post(`${import.meta.env.VITE_BASE_API_URL}/expense/create`, {
        description,
        amount: parseFloat(amount),
        payer_id: payer.id,
        split_with_ids: selectedUsers,
      });

      // Tozalash va yangilash
      setIsModalOpen(false);
      setDescription("");
      setAmount("");
      setSelectedUsers([]);
      getData();
    } catch (error) {
      alert("Xarajatni saqlashda xatolik!");
    }
  };

  const handleConfirm = async (debtorName) => {
    if (!window.confirm(`${debtorName} pulni berganini tasdiqlaysizmi?`))
      return;

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/expense/confirm-payment`,
        {
          creditor_telegram_id: parseInt(MY_TELEGRAM_ID),
          debtor_full_name: debtorName,
        },
      );

      // Muvaffaqiyatli bo'lsa ma'lumotlarni yangilash
      getData();
    } catch (error) {
      console.error("Tasdiqlashda xato:", error);
      alert("Xatolik yuz berdi. Qayta urinib ko'ring.");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-blue-600" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-lg font-medium text-gray-700"
        >
          Yuklanmoqda...
        </motion.p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50 px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">
            Xatolik yuz berdi!
          </h1>
          <p className="text-gray-600 mt-2 mb-6">
            Kechirasiz, sahifani yuklashda muammo yuzaga keldi. Iltimos, qayta
            urinib ko'ring.
          </p>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24 select-none">
      {/* --- HEADER --- */}
      <header className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
            <User size={20} />
          </div>
          <div>
            <h1 className="text-sm font-semibold">
              Salom,{" "}
              {
                data.allUsers.find((u) => u.telegram_id === MY_TELEGRAM_ID)
                  ?.full_name
              }
              !
            </h1>
            <p className="text-xs text-slate-500">Kvartira boshqaruvi</p>
          </div>
        </div>
        <button
          onClick={getData}
          className="p-2 bg-slate-100 rounded-full active:scale-90 transition-transform"
        >
          <Receipt size={20} className="text-slate-600" />
        </button>
      </header>

      <main className="p-4 space-y-6">
        {/* --- SUMMARY CARD --- */}
        <section className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 overflow-hidden relative">
          <div className="relative z-10">
            <p className="text-indigo-100 text-sm">Sizning balansingiz</p>
            <h2 className="text-4xl font-bold mt-1">
              {data.total?.toLocaleString()}{" "}
              <span className="text-lg font-normal">so'm</span>
            </h2>
            <div className="mt-6 flex gap-3">
              <div className="bg-white/15 backdrop-blur-md flex-1 p-3 rounded-2xl border border-white/10">
                <div className="flex items-center gap-1 text-green-300 mb-1">
                  <ArrowDownLeft size={14} />
                  <p className="text-[10px] uppercase font-bold tracking-wider">
                    Olish
                  </p>
                </div>
                <p className="font-bold text-lg">
                  {data.totlalReceivables?.toLocaleString()}
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-md flex-1 p-3 rounded-2xl border border-white/10">
                <div className="flex items-center gap-1 text-red-300 mb-1">
                  <ArrowUpRight size={14} />
                  <p className="text-[10px] uppercase font-bold tracking-wider">
                    Berish
                  </p>
                </div>
                <p className="font-bold text-lg">
                  {data.totlalPayables?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </section>

        {/* --- DEBTORS & CREDITORS LIST --- */}
        <div className="space-y-4">
          {/* --- DEBTORS LIST (Sizga berishi kerak bo'lganlar) --- */}
          {data.receivables.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">
                Sizga berishi kerak
              </h3>
              {data.receivables.map((item, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx}
                  className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold">
                      {item.full_name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.full_name}</p>
                      <p className="text-xs text-green-600 font-medium font-mono">
                        +{parseFloat(item.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* TASDIQLASH TUGMASI */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleConfirm(item.full_name)}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors shadow-lg shadow-green-100"
                  >
                    <CheckCircle2 size={16} />
                    Tasdiqlash
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Berish kerak bo'lganlar */}
          {data.payables.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">
                Siz berishingiz kerak
              </h3>
              {data.payables.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                      {item.full_name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.full_name}</p>
                      <p className="text-xs text-red-500 font-medium">
                        Qarzingiz
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-red-600">
                    -{parseFloat(item.amount).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Settled - Hisobi yopiqlar */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">
              Hisoblar yopiq
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.settled.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white px-4 py-2 rounded-full border border-slate-200 flex items-center gap-2 text-sm text-slate-600"
                >
                  <CheckCircle2 size={14} className="text-indigo-500" />
                  {item.full_name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* --- ADD BUTTON --- */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 text-white rounded-2xl shadow-2xl shadow-indigo-300 flex items-center justify-center z-20"
      >
        <Plus size={32} />
      </motion.button>

      {/* --- MODAL --- */}
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
                  className="p-2 bg-slate-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                    Nima uchun? (Tavsif)
                  </label>
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full mt-2 p-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-medium"
                    placeholder="Masalan: Bozorlik"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                    Summa (so'm)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full mt-2 p-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-black text-3xl text-indigo-600"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1 block mb-3">
                    Kimlar uchun? (Split)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {data.allUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => toggleUser(user.id)}
                        className={`p-3 rounded-2xl border text-sm font-bold transition-all flex items-center gap-2 ${
                          selectedUsers.includes(user.id)
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        <Users size={16} />
                        {user.full_name.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-bold text-lg mt-4 flex items-center justify-center gap-3 shadow-xl shadow-indigo-200"
                >
                  <Send size={20} /> Yuborish
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
