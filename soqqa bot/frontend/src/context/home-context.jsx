import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const HomeContext = createContext();

const MY_TELEGRAM_ID = "1105787891";
// const MY_TELEGRAM_ID = "896307244";

const HomeProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  const mydata = useMemo(() => {
    return (
      data?.allUsers?.find((u) => u.telegram_id === MY_TELEGRAM_ID) || null
    );
  }, [data]);

  const getData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/expense/balance/${MY_TELEGRAM_ID}`,
      );
      setData(res.data);
    } catch (error) {
      console.error("Xatolik yuz berdi:", error.message);
      // setError(true);
      setData({
        totlalReceivables: 357142.85000000003,
        totlalPayables: 28571.43,
        total: 328571.42000000004,
        receivables: [
          {
            full_name: "Azizbek Karimov",
            amount: "71428.57",
          },
          {
            full_name: "Diyorbek Xasanov",
            amount: "71428.57",
          },
          {
            full_name: "Sarvar Abdullayev",
            amount: "71428.57",
          },
          {
            full_name: "Islomjon Turgunov",
            amount: "71428.57",
          },
          {
            full_name: "Nodirbek Yuldashev",
            amount: "71428.57",
          },
        ],
        payables: [
          {
            full_name: "Mo’minjon Qadambayev",
            amount: "28571.43",
            card_number: "8600050406050408",
          },
        ],
        settled: [],
        allUsers: [
          {
            id: 7,
            telegram_id: "1105787891",
            username: "jasurbbbek",
            full_name: "Жасурбек",
            created_at: "2026-02-26T07:31:26.580Z",
            card_number: "9860020102030504",
          },
          {
            id: 8,
            telegram_id: "896307244",
            username: "qadamboyev_12_03",
            full_name: "Mo’minjon Qadambayev",
            created_at: "2026-02-26T07:31:26.580Z",
            card_number: "8600050406050408",
          },
          {
            id: 9,
            telegram_id: "998901112233",
            username: "aziz_dev",
            full_name: "Azizbek Karimov",
            created_at: "2026-02-26T07:31:26.580Z",
            card_number: "8600123412341234",
          },
          {
            id: 10,
            telegram_id: "998902223344",
            username: "diyor_front",
            full_name: "Diyorbek Xasanov",
            created_at: "2026-02-26T07:31:26.580Z",
            card_number: "9860032109876543",
          },
          {
            id: 11,
            telegram_id: "998903334455",
            username: "sarvar_code",
            full_name: "Sarvar Abdullayev",
            created_at: "2026-02-26T07:31:26.580Z",
            card_number: "8600556677889900",
          },
          {
            id: 12,
            telegram_id: "998904445566",
            username: "islom_ui",
            full_name: "Islomjon Turgunov",
            created_at: "2026-02-26T07:31:26.580Z",
            card_number: "9860023456789012",
          },
          {
            id: 13,
            telegram_id: "998905556677",
            username: "nodir_js",
            full_name: "Nodirbek Yuldashev",
            created_at: "2026-02-26T07:31:26.580Z",
            card_number: "8600987612345678",
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
