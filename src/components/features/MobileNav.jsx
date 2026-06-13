import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { LayoutDashboard, CheckSquare, Calendar, BarChart3 } from "lucide-react";

export default function MobileNav() {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", url: createPageUrl("Dashboard") },
    { icon: CheckSquare, label: "Tasks", url: createPageUrl("Tasks") },
    { icon: Calendar, label: "Calendar", url: createPageUrl("Calendar") },
    { icon: BarChart3, label: "Analytics", url: createPageUrl("Analytics") },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <Link
              key={item.label}
              to={item.url}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? "scale-110" : ""} transition-transform`} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}