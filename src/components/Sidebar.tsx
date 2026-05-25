import Link from 'next/link';
import { Home, LineChart, BarChart2, Calendar, Settings } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800 text-zinc-400 flex flex-col h-screen fixed">
      <div className="p-6">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 mb-2">
          Your's
        </h1>
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Trading Journal</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 transition-all font-medium">
          <Home size={18} /> Dashboard
        </Link>
        <Link href="/journal" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:text-zinc-100 hover:bg-zinc-800 transition-all">
          <LineChart size={18} /> Journal
        </Link>
        <Link href="/analytics" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:text-zinc-100 hover:bg-zinc-800 transition-all">
          <BarChart2 size={18} /> Analytics
        </Link>
        <Link href="/calendar" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:text-zinc-100 hover:bg-zinc-800 transition-all">
          <Calendar size={18} /> Calendar
        </Link>
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:text-zinc-100 hover:bg-zinc-800 transition-all">
          <Settings size={18} /> Settings
        </Link>
      </div>
    </div>
  );
}
