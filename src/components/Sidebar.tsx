"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart3, 
  Calendar, 
  Menu, 
  X 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // Mobile toggle switch state

  // Don't show sidebar on the login gatekeeper terminal page
  if (pathname === "/login") return null;

  const menuItems = [
    { name: "Dashboard", href: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Journal", href: "/journal", icon: <BookOpen size={18} /> },
    { name: "Analytics", href: "/analytics", icon: <BarChart3 size={18} /> },
    { name: "Calendar", href: "/calendar", icon: <Calendar size={18} /> },
  ];

  return (
    <>
      {/* 1. MOBILE TOP NAVIGATION BAR (Only visible on small mobile screens) */}
      <div className="md:hidden w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <span className="text-xl font-black text-emerald-500 tracking-tight">Your's</span>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 2. BLACK BACKGROUND OVERLAY (Dims the dashboard background when mobile menu is open) */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden animate-fade-in"
        />
      )}

      {/* 3. CORE SIDEBAR PANEL (Desktop-fixed, Mobile sliding panel) */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-900 p-6 flex flex-col justify-between z-50 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="space-y-8">
          {/* Brand header */}
          <div>
            <h2 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400">
              Your's
            </h2>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Trading Journal</p>
          </div>

          {/* Navigation link stacks */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)} // Close sliding drawer when a link is clicked
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-l-4 border-emerald-500"
                      : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info brand token label */}
        <div className="text-[10px] font-medium text-zinc-400/80 font-mono">
          v1.4.0 • Secured Terminal
        </div>
      </aside>
    </>
  );
}
