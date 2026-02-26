import { User } from "lucide-react";
import { useHome } from "../context/home-context";

const Header = () => {
  const { full_name } = useHome();

  return (
    <header className="bg-white px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
          <User size={20} />
        </div>
        <div>
          <h1 className="text-sm font-semibold">Salom, {full_name}!</h1>
          <p className="text-xs text-slate-500">Kvartira boshqaruvi</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
