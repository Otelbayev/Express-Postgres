import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import { useHome } from "../context/home-context";

const ArchivePage = () => {
  const [archive, setArchive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const { MY_TELEGRAM_ID } = useHome();

  const fetchArchive = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/expense/archive/${MY_TELEGRAM_ID}`,
      );
      if (res.data.success) setArchive(res.data.archive);
    } catch (error) {
      console.error("Arxivni yuklashda xato:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchive();
  }, []);

  const formatDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Bugun";
    if (date.toDateString() === yesterday.toDateString()) return "Kecha";

    return date.toLocaleDateString("uz-UZ", { day: "numeric", month: "long" });
  };

  // Ma'lumotlarni sana bo'yicha guruhlash
  const groupedData = archive.reduce((acc, item) => {
    const dateKey = new Date(item.created_at).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {});

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-bold text-indigo-600">
        Yuklanmoqda...
      </div>
    );

  return (
    <div className="bg-slate-50 pb-20 min-h-screen max-w-md mx-auto">
      <main className="p-4">
        {Object.keys(groupedData).length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Clock size={48} className="mx-auto mb-4 opacity-20" />
            <p>Hozircha arxiv bo'sh</p>
          </div>
        ) : (
          Object.entries(groupedData).map(([dateKey, expenses]) => (
            <div key={dateKey} className="mb-8">
              {/* --- KUN SARMALAVHASI --- */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                  {formatDateLabel(dateKey)}
                </span>
                <div className="h-px w-full bg-slate-200"></div>
              </div>

              <div className="space-y-3">
                {expenses.map((exp) => {
                  const isExpanded = expandedId === exp.id;

                  // Sizni (payer) qarzdorlar ro'yxatidan chiqarish
                  const pendingPartners = exp.pending_users.filter(
                    (u) => u.name !== "Жасурбек",
                  );
                  const paidPartners = exp.paid_users.filter(
                    (u) => u.name !== "Жасурбек",
                  );

                  const totalPartners =
                    pendingPartners.length + paidPartners.length;
                  const progressPercent =
                    totalPartners === 0
                      ? 100
                      : (paidPartners.length / totalPartners) * 100;

                  return (
                    <motion.div
                      key={exp.id}
                      layout
                      className="bg-white rounded-[28px] overflow-hidden shadow-sm border border-slate-100"
                    >
                      {/* HEADER */}
                      <div
                        className="p-5 cursor-pointer flex justify-between items-center"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : exp.id)
                        }
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">
                              <Clock size={10} />
                              {new Date(exp.created_at).toLocaleTimeString(
                                "uz-UZ",
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </div>
                            {progressPercent === 100 && (
                              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                                YOPILGAN
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-slate-800 leading-tight">
                            {exp.description}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-black text-slate-900 leading-none">
                              {parseFloat(exp.amount).toLocaleString()}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">
                              so'm
                            </p>
                          </div>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                          >
                            <ChevronDown size={18} className="text-slate-300" />
                          </motion.div>
                        </div>
                      </div>

                      {/* PROGRESS BAR */}
                      <div className="h-[3px] w-full bg-slate-50">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          className={`h-full transition-colors duration-500 ${progressPercent === 100 ? "bg-green-500" : "bg-indigo-500"}`}
                        />
                      </div>

                      {/* DETAILS */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="bg-slate-50/40"
                          >
                            <div className="p-5 grid grid-cols-2 gap-4 border-t border-slate-50">
                              <div className="space-y-2">
                                <span className="text-[10px] font-black text-green-500 uppercase flex items-center gap-1">
                                  <CheckCircle2 size={12} /> To'ladi
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {paidPartners.map((u, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-1 bg-white border border-green-100 text-green-600 text-[10px] font-bold rounded-lg shadow-sm"
                                    >
                                      {u.name.split(" ")[0]}
                                    </span>
                                  ))}
                                  {paidPartners.length === 0 && (
                                    <span className="text-[10px] text-slate-300 italic font-medium">
                                      Hali hech kim
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <span className="text-[10px] font-black text-amber-500 uppercase flex items-center gap-1">
                                  <AlertCircle size={12} /> Kutilyapti
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {pendingPartners.map((u, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-1 bg-white border border-amber-100 text-amber-600 text-[10px] font-bold rounded-lg shadow-sm"
                                    >
                                      {u.name.split(" ")[0]}
                                    </span>
                                  ))}
                                  {pendingPartners.length === 0 && (
                                    <span className="text-[10px] text-green-600 font-black bg-green-100/50 px-2 py-1 rounded-lg italic">
                                      TAMOM! ✅
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default ArchivePage;
