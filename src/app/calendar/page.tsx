"use client";

import { useMemo, useState } from "react";
import { Calendar as CalendarIcon, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useTrades } from "@/context/TradesContext";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const { trades, isLoaded } = useTrades();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed

  // Navigate months
  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Compute daily PnL map for the current view month
  const dailyPnl = useMemo(() => {
    const map: Record<number, number> = {};
    const dailyTrades: Record<number, number> = {};

    trades.forEach((trade) => {
      const d = new Date(trade.date);
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
        const day = d.getDate();
        map[day] = (map[day] || 0) + trade.netPnl;
        dailyTrades[day] = (dailyTrades[day] || 0) + 1;
      }
    });

    return { pnl: map, count: dailyTrades };
  }, [trades, viewYear, viewMonth]);

  // Calendar grid calculation
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Build grid: leading blanks + days
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  // Monthly summary
  const monthTotalPnl = Object.values(dailyPnl.pnl).reduce((sum, v) => sum + v, 0);
  const tradingDays = Object.keys(dailyPnl.pnl).length;
  const greenDays = Object.values(dailyPnl.pnl).filter(v => v > 0).length;
  const redDays = Object.values(dailyPnl.pnl).filter(v => v < 0).length;

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-zinc-500">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Trade Calendar</h1>
        <p className="text-zinc-400 mt-1">Track day-to-day frequency, consistency, and profitability.</p>
      </div>

      {/* Monthly Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Monthly P&L</span>
          <span className={`text-xl font-extrabold font-mono ${monthTotalPnl > 0 ? "text-emerald-400" : monthTotalPnl < 0 ? "text-rose-400" : "text-zinc-400"}`}>
            {monthTotalPnl > 0 ? "+" : ""}${monthTotalPnl.toFixed(2)}
          </span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Trading Days</span>
          <span className="text-xl font-extrabold font-mono text-cyan-400">{tradingDays}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Green Days</span>
          <span className="text-xl font-extrabold font-mono text-emerald-400">{greenDays}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Red Days</span>
          <span className="text-xl font-extrabold font-mono text-rose-400">{redDays}</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        {/* Month Nav */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={goToPrevMonth}
            className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
            <CalendarIcon className="text-emerald-400" size={20} />
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Tip */}
        <div className="flex justify-end mb-4">
          <span className="text-xs text-zinc-400 flex items-center gap-1 bg-zinc-950 px-3 py-1 rounded-md border border-zinc-800">
            <AlertCircle size={12} className="text-cyan-400" /> Colors show daily P&L
          </span>
        </div>

        {/* Day-of-week header */}
        <div className="grid grid-cols-7 gap-3 text-center font-medium text-sm text-zinc-500 border-b border-zinc-800 pb-2 mb-4">
          {DAY_NAMES.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7 gap-3">
          {calendarCells.map((day, idx) => {
            if (day === null) {
              return <div key={`blank-${idx}`} className="h-24" />;
            }

            const pnl = dailyPnl.pnl[day];
            const tradeCount = dailyPnl.count[day] || 0;
            const hasTrades = tradeCount > 0;
            const isGreenDay = hasTrades && pnl > 0;
            const isRedDay = hasTrades && pnl < 0;
            const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

            return (
              <div
                key={day}
                className={`h-24 p-2 rounded-lg border flex flex-col justify-between items-start transition-all cursor-pointer ${
                  isGreenDay
                    ? "bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-400"
                    : isRedDay
                    ? "bg-rose-950/20 border-rose-500/30 hover:border-rose-400"
                    : isToday
                    ? "bg-cyan-950/10 border-cyan-500/30 hover:border-cyan-400"
                    : "bg-zinc-950 border-zinc-800/80 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-bold ${
                      isGreenDay
                        ? "text-emerald-400"
                        : isRedDay
                        ? "text-rose-400"
                        : isToday
                        ? "text-cyan-400"
                        : "text-zinc-400"
                    }`}
                  >
                    {day}
                  </span>
                  {tradeCount > 0 && (
                    <span className="text-[10px] text-zinc-500 bg-zinc-900 px-1 rounded">
                      {tradeCount}T
                    </span>
                  )}
                </div>

                {hasTrades && (
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                      isGreenDay
                        ? "text-emerald-400 bg-emerald-500/10"
                        : "text-rose-400 bg-rose-500/10"
                    }`}
                  >
                    {pnl > 0 ? "+" : ""}${pnl.toFixed(2)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}