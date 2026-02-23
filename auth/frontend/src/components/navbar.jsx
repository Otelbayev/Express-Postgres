import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const linkClass = "px-4 py-2 rounded-lg transition font-medium";
  const activeClass = "bg-indigo-600 text-white";
  const inactiveClass = "text-gray-700 hover:bg-indigo-100";

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="text-xl font-bold text-indigo-600">
            MyApp
          </NavLink>

          {/* Links */}
          <div className="flex gap-3 items-center">
            {!user ? (
              <>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `${linkClass} ${isActive ? activeClass : inactiveClass}`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `${linkClass} ${isActive ? activeClass : inactiveClass}`
                  }
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `${linkClass} ${isActive ? activeClass : inactiveClass}`
                  }
                >
                  Register
                </NavLink>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className={`${linkClass} bg-red-500 text-white hover:bg-red-600`}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
