import { User, TrendingUp } from "lucide-react";
import { useHome } from "../context/home-context";
import { useEffect, useState } from "react";

const Header = () => {
  const { full_name } = useHome();

  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch(
          "https://cbu.uz/uz/arkhiv-kursov-valyut/json/",
        );
        if (!response.ok) throw new Error("Tarmoq xatosi");
        const data = await response.json();
        const usd = data.find((item) => item.Ccy === "USD");
        if (usd) setRate(usd.Rate);
      } catch (err) {
        console.error("Kursni yuklashda xatolik:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRate();
  }, []);

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
        {/* Chap tomon: Foydalanuvchi profili */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-linear-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <User size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              Xush kelibsiz
            </span>
            <h1 className="text-sm font-bold text-slate-800 leading-none">
              {full_name || "Mehmon"}
            </h1>
          </div>
        </div>

        {/* O'ng tomon: Kurs ma'lumoti */}
        <div className="bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-100 flex items-center gap-2">
          <div className="bg-emerald-100 p-1 rounded-full">
            <TrendingUp size={12} className="text-emerald-600" />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-slate-400 font-medium">
              USD Kursi
            </span>
            <p className="text-[11px] font-bold text-slate-700">
              {loading
                ? "..."
                : rate
                  ? `${Number(rate).toLocaleString()} so'm`
                  : "Noma'lum"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
