"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, LogOut, Home, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  navItems: NavItem[];
  themeColor: "blue" | "emerald" | "rose";
  portalName: string;
}

export default function Sidebar({ navItems, themeColor, portalName }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const themeColors = {
    blue: {
      primary: "from-blue-500 to-purple-500",
      hover: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
      active: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
    },
    emerald: {
      primary: "from-emerald-500 to-teal-500",
      hover: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
      active: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800",
    },
    rose: {
      primary: "from-rose-500 to-orange-500",
      hover: "hover:bg-rose-50 dark:hover:bg-rose-900/20",
      active: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-200 dark:border-rose-800",
    },
  };

  const colors = themeColors[themeColor];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col fixed left-0 top-0 h-screen z-40">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${colors.primary} rounded-xl blur-md opacity-50`}></div>
            <div className={`relative p-2.5 bg-gradient-to-br ${colors.primary} rounded-xl shadow-lg`}>
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">Smart Hiring OS</span>
            <p className={`text-xs ${colors.text} font-medium`}>{portalName}</p>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className={`p-4 border-b ${colors.border} bg-gradient-to-r ${colors.primary} bg-opacity-5`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors.primary} flex items-center justify-center text-white font-bold`}>
            {user?.email?.[0].toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {user?.email?.split("@")[0] || "User"}
            </p>
            <p className={`text-xs ${colors.text} capitalize`}>{user?.role || "User"}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? colors.active
                  : `text-slate-600 dark:text-slate-400 ${colors.hover}`
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
        <Link
          href="/"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-slate-600 dark:text-slate-400 ${colors.hover}`}
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Home</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
