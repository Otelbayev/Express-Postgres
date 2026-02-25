import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  CheckCircle2,
  User,
  Receipt,
  ChevronRight,
  Send,
  Users,
} from "lucide-react";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [neighbors, setNeighbors] = useState([
    { id: 1, name: "Asilbek", debt: 50000, type: "receivable" }, // Sizga berishi kerak
    { id: 2, name: "Javohir", debt: 25000, type: "payable" }, // Siz berishingiz kerak
    { id: 3, name: "Sardor", debt: 0, type: "none" },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 select-none">
      {/* --- HEADER --- */}
      <header className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
            <User size={20} />
          </div>
          <div>
            <h1 className="text-sm font-semibold">Salom, Azizbek!</h1>
            <p className="text-xs text-slate-500">Kvartira boshqaruvi</p>
          </div>
        </div>
        <button className="p-2 bg-slate-100 rounded-full">
          <Receipt size={20} className="text-slate-600" />
        </button>
      </header>

      <main className="p-4 space-y-6">
        {/* --- SUMMARY CARD --- */}
        <section className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100">
          <p className="text-indigo-100 text-sm">Umumiy balans</p>
          <h2 className="text-3xl font-bold mt-1">25,000 so'm</h2>
          <div className="mt-4 flex gap-4">
            <div className="bg-white/10 flex-1 p-3 rounded-2xl">
              <p className="text-[10px] uppercase opacity-70">
                Olishingiz kerak
              </p>
              <p className="font-semibold">50,000</p>
            </div>
            <div className="bg-white/10 flex-1 p-3 rounded-2xl">
              <p className="text-[10px] uppercase opacity-70">
                Berishingiz kerak
              </p>
              <p className="font-semibold">25,000</p>
            </div>
          </div>
        </section>

        {/* --- NEIGHBORS LIST --- */}
        <section>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Users size={18} /> Xonadoshlar
          </h3>
          <div className="space-y-3">
            {neighbors.map((user) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={user.id}
                className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-medium">
                    {user.name[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold">{user.name}</h4>
                    {user.type === "receivable" && (
                      <p className="text-xs text-green-600 font-medium">
                        Sizga berishi kerak: {user.debt.toLocaleString()} so'm
                      </p>
                    )}
                    {user.type === "payable" && (
                      <p className="text-xs text-red-500 font-medium">
                        Berishingiz kerak: {user.debt.toLocaleString()} so'm
                      </p>
                    )}
                    {user.type === "none" && (
                      <p className="text-xs text-slate-400 italic">
                        Qarzlar yo'q
                      </p>
                    )}
                  </div>
                </div>

                {user.type === "receivable" && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="bg-green-50 text-green-600 p-2 rounded-lg"
                  >
                    <CheckCircle2 size={24} />
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* --- ADD EXPENSE BUTTON --- */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center z-20"
      >
        <Plus size={28} />
      </motion.button>

      {/* --- ADD EXPENSE MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-4xl p-6 z-40 max-h-[90vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
              <h2 className="text-xl font-bold mb-6 text-center">
                Yangi xarajat qo'shish
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 ml-1">
                    Nima sotib oldingiz?
                  </label>
                  <textarea
                    className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Masalan: Bozorlik, Kartoshka..."
                    rows="2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600 ml-1">
                    Summa (so'm)
                  </label>
                  <input
                    type="number"
                    className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600 ml-1 block mb-2">
                    Kimlarga bo'linadi?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {neighbors.map((n) => (
                      <button
                        key={n.id}
                        className="px-4 py-2 rounded-full border border-slate-200 text-sm active:bg-indigo-600 active:text-white transition-colors"
                      >
                        {n.name}
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold mt-4 flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
                >
                  <Send size={18} /> Yuborish
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
