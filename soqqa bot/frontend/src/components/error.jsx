import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] bg-red-50 px-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center"
      >
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800">Xatolik yuz berdi!</h1>
        <p className="text-gray-600 mt-2 mb-6">
          Kechirasiz, sahifani yuklashda muammo yuzaga keldi. Iltimos, qayta
          urinib ko'ring.
        </p>
      </motion.div>
    </div>
  );
};

export default Error;
