import { NavLink } from "react-router-dom";
import { Home, Archive, Settings } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  {
    name: "Home",
    path: "/",
    icon: Home,
  },
  {
    name: "Archive",
    path: "/archive",
    icon: Archive,
  },
  {
    name: "Setting",
    path: "/setting",
    icon: Settings,
  },
];

export default function Bottom() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-lg z-10">
      <div className="flex justify-around items-center h-16 relative">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center relative w-full h-full"
            >
              {({ isActive }) => (
                <>
                  {/* Active Background Animation */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-slate-100 rounded-xl mx-4 my-2"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    />
                  )}

                  <div className="relative flex flex-col items-center">
                    <Icon
                      size={20}
                      className={`transition-all duration-300 ${
                        isActive ? "text-black" : "text-slate-400"
                      }`}
                    />
                    <span
                      className={`text-xs mt-1 transition-all duration-300 ${
                        isActive ? "text-black font-medium" : "text-slate-400"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
