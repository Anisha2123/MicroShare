import {
  Home,
  User,
  LayoutDashboard,
  SquarePlus,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function MobileBottomNav() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50
        bg-white/90 backdrop-blur-xl
        border-t border-gray-200
        flex justify-around items-center
        h-14
        lg:hidden
      "
    >
      <Item to="/feed" icon={<Home size={22} />} />

      {/* Create */}
      <Item
        to="/create-tip"
        icon={<SquarePlus size={24} />}
        highlight
      />

      <Item to="/dashboard" icon={<LayoutDashboard size={22} />} />
      <Item to="/profile" icon={<User size={22} />} />

      {/* Logout */}
      <button
        onClick={logout}
        className="
          flex items-center justify-center
          w-10 h-10 rounded-full
          text-gray-500
          hover:text-red-500
          transition
        "
      >
        <LogOut size={20} />
      </button>
    </nav>
  );
}

function Item({ to, icon, highlight }: any) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        flex items-center justify-center
        w-10 h-10 rounded-full
        transition
        ${
          highlight
            ? "text-purple-600"
            : isActive
            ? "text-purple-600"
            : "text-gray-600"
        }
      `
      }
    >
      {icon}
    </NavLink>
  );
}
