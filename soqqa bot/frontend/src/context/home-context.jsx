import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const HomeContext = createContext();

const HomeProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  // --- AVTOMATIK ID OLISH QISMI ---
  const MY_TELEGRAM_ID = useMemo(() => {
    // Telegram WebApp obyekti mavjudligini tekshiramiz
    const tg = window.Telegram?.WebApp;
    // Agar Telegramda ochilgan bo'lsa ID ni olamiz, aks holda test uchun null (yoki eski ID)
    return tg?.initDataUnsafe?.user?.id?.toString() || null;
  }, []);
  // --------------------------------

  const mydata = useMemo(() => {
    return (
      data?.allUsers?.find((u) => u.telegram_id === MY_TELEGRAM_ID) || null
    );
  }, [data, MY_TELEGRAM_ID]);

  const getData = async () => {
    // Agar ID hali aniqlanmagan bo'lsa so'rov yubormaymiz
    if (!MY_TELEGRAM_ID) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/expense/balance/${MY_TELEGRAM_ID}`,
      );
      setData(res.data);
      setError(false);
    } catch (error) {
      console.error("Xatolik yuz berdi:", error.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [MY_TELEGRAM_ID]); // ID o'zgarsa (aniqlansa) qayta yuklaydi

  return (
    <HomeContext.Provider
      value={{
        loading,
        data,
        error,
        getData,
        MY_TELEGRAM_ID,
        full_name: mydata?.full_name || null,
        mydata,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export const useHome = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useHome must be used within a HomeProvider");
  }
  return context;
};

export default HomeProvider;
