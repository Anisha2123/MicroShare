import {
  Home,
  LayoutDashboard,
  User,
  Bookmark,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function ProfileSidebar() {
  return (
    <aside
  className="
    hidden lg:flex
    fixed left-0 top-0 h-screen w-[260px]
    bg-white/80 backdrop-blur-xl
    border-r border-gray-200/60
    px-6 py-8
    flex-col
  "
>

      {/* Logo / App Name */}
      <div className="mb-10">
        <h1 className="text-xl font-semibold tracking-tight">
          Micro<span className="text-purple-600">Share</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 text-sm">
        <SidebarItem to="/feed" icon={<Home size={18} />} label="Feed" />
        <SidebarItem to="/create-tip" icon={<LayoutDashboard size={18} />} label="Share Tip" />
        {/* <SidebarItem to="/saved" icon={<Bookmark size={18} />} label="Saved" /> */}
        {/* <SidebarItem to="/followers" icon={<Users size={18} />} label="Followers" /> */}
        {/* <SidebarItem to="/following" icon={<Users size={18} />} label="Following" /> */}
                <SidebarItem to="/profile" icon={<User size={18} />} label="Profile" />
        {/* <SidebarItem to="/settings" icon={<Settings size={18} />} label="Settings" /> */}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto pt-6 border-t border-gray-200/60">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="
            flex items-center gap-3 w-full
            text-sm text-gray-600
            px-3 py-2 rounded-lg
            hover:bg-red-50 hover:text-red-600
            transition
          "
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

/* ---------------- Sidebar Item ---------------- */

function SidebarItem({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        flex items-center gap-3
        px-3 py-2.5 rounded-xl
        transition
        ${
          isActive
            ? "bg-purple-50 text-purple-700 font-medium"
            : "text-gray-700 hover:bg-gray-100"
        }
      `
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
