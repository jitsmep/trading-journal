"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LineChart, BarChart2, Calendar, Settings } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  // This function checks if the link matches the current URL!
  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium ${
      isActive
        ? "text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10"
        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
    }`;
  };

  return (
    <div className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-screen fixed transition-colors duration-300">
      <div className="p-6">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 mb-2">
          Your's
        </h1>
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Trading Journal</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <Link href="/" className={getLinkClasses("/")}>
          <Home size={18} /> Dashboard
        </Link>
        <Link href="/journal" className={getLinkClasses("/journal")}>
          <LineChart size={18} /> Journal
        </Link>
        <Link href="/analytics" className={getLinkClasses("/analytics")}>
          <BarChart2 size={18} /> Analytics
        </Link>
        <Link href="/calendar" className={getLinkClasses("/calendar")}>
          <Calendar size={18} /> Calendar
        </Link>
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <Link href="/settings" className={getLinkClasses("/settings")}>
          <Settings size={18} /> Settings
        </Link>
      </div>
    </div>
  );
}
