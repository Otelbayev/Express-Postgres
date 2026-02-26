import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import axios from "axios";
import Loading from "../components/loading";
import Error from "../components/error";
import Modal from "../components/modal";
import { useHome } from "../context/home-context";

const Home = () => {
  const { loading, data, error, getData, MY_TELEGRAM_ID } = useHome();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  if (loading) return <Loading />;

  if (error) return <Error />;

  return (
    <div className="max-w-md mx-auto">
      <main className="p-4 space-y-6">
        {/* --- SUMMARY CARD --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
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
        </motion.div>

        {/* --- DEBTORS & CREDITORS LIST --- */}
        <div className="space-y-4">
          {/* --- DEBTORS LIST (Sizga berishi kerak bo'lganlar) --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            delay={0.2}
          >
            {data.receivables.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Sizga berishi kerak
                </h3>
                {data.receivables.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold">
                        {item.full_name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {item.full_name}
                        </p>
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
                  </div>
                ))}
              </div>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            delay={0.4}
          >
            {/* Berish kerak bo'lganlar */}
            {data.payables.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Siz berishingiz kerak
                </h3>
                {data.payables.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                          {item.full_name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            {item.full_name}
                          </p>
                          <p className="text-xs text-red-500 font-medium">
                            Qarzingiz
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-red-600">
                        -{parseFloat(item.amount).toLocaleString()}
                      </p>
                    </div>

                    {/* CARD NUMBER SECTION */}
                    <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl">
                      <span className="text-sm font-mono text-slate-700">
                        {item.card_number}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.card_number);
                          alert("Karta raqami copy qilindi ✅");
                        }}
                        className="text-xs bg-slate-200 hover:bg-slate-300 px-3 py-1 rounded-lg transition"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            delay={0.6}
          >
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
          </motion.div>
        </div>
      </main>

      <Modal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        data={data}
        getData={getData}
        MY_TELEGRAM_ID={MY_TELEGRAM_ID}
      />
    </div>
  );
};

export default Home;
