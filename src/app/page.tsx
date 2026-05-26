"use client";

import React from "react";
import { StatCard } from "@/components/StatCard";
import { PnlChart } from "@/components/PnlChart";
import { useTrades } from "@/context/TradesContext";
import { DollarSign, Percent, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { trades, isLoaded } = useTrades();

  if (!isLoaded) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-end">
          <div className="h-10 bg-zinc-200 dark:bg-zinc-900 rounded w-1/4" />
          <div className="h-10 bg-zinc-200 dark:bg-zinc-900 rounded w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-zinc-200 dark:bg-zinc-900 rounded-xl" />
          ))}
        </div>
        <div className="h-[350px] bg-zinc-200 dark:bg-zinc-900 rounded-xl" />
      </div>
    );
  }

  // Sort trades: Chronological (oldest to newest) for chart equity accumulation
  const chronologicalTrades = [...trades].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Sort trades: Reverse chronological (newest to oldest) for recent trades list
  const recentTrades = [...trades].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Dynamic Metrics Calculation
  const totalPnl = trades.reduce((acc, trade) => acc + trade.netPnl, 0);
  const winRate = trades.length > 0 
    ? ((trades.filter(t => t.netPnl > 0).length / trades.length) * 100).toFixed(1)
    : "0.0";
  const totalTrades = trades.length;

  // Average R:R Ratio Calculation
  const validRrTrades = trades.filter(t => t.rrRatio > 0);
  const avgRr = validRrTrades.length > 0
    ? (validRrTrades.reduce((acc, t) => acc + t.rrRatio, 0) / validRrTrades.length).toFixed(2)
    : "1.0";

  // Generate Equity Curve Chart Data
  let cumulative = 10000; // Starting account balance
  const pnlData = chronologicalTrades.map(trade => {
    cumulative += trade.netPnl;
    return {
      date: new Date(trade.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      balance: cumulative,
      netPnl: trade.netPnl
    };
  });

  const displayPnlData = pnlData.length > 0 
    ? pnlData 
    : [{ date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), balance: 10000, netPnl: 0 }];

  return (
    <div className="space-y-6 pb-12 transition-colors duration-300">
      <div className="flex justify-between items-end border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 tracking-tight">
            Dashboard
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Overview of your real-time trading performance.</p>
        </div>
        <Link 
          href="/journal/new" 
          className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-400 dark:hover:bg-emerald-500 text-white dark:text-zinc-950 font-extrabold px-5 py-3 rounded-lg transition-all shadow-lg text-sm hover:scale-[1.02]"
        >
          + Log New Trade
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Net PnL"
          value={`$${totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          trend="Overall Balance Change"
          trendUp={totalPnl >= 0}
          icon={<DollarSign size={20} className={totalPnl >= 0 ? "text-emerald-500 dark:text-emerald-400" : "text-rose-600 dark:text-rose-500"} />}
          className={totalPnl >= 0 ? "border-emerald-200 dark:border-emerald-500/20 shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.02)]" : "border-rose-200 dark:border-rose-500/20 shadow-sm dark:shadow-none"}
        />
        <StatCard
          title="Win Rate"
          value={`${winRate}%`}
          trend={Number(winRate) >= 50 ? "Profitable Strategy" : "Needs risk management"}
          trendUp={Number(winRate) >= 50}
          icon={<Percent size={20} className="text-cyan-500 dark:text-cyan-400" />}
          className="border-cyan-200 dark:border-cyan-500/20 shadow-sm dark:shadow-none"
        />
        <StatCard
          title="Total Trades"
          value={totalTrades.toString()}
          trend="Logged Sessions"
          trendUp={true}
          icon={<TrendingUp size={20} className="text-purple-500 dark:text-purple-400" />}
          className="border-purple-200 dark:border-purple-500/20 shadow-sm dark:shadow-none"
        />
        <StatCard
          title="Avg Risk/Reward"
          value={`${avgRr}R`}
          trend={Number(avgRr) >= 1.5 ? "Healthy Ratio" : "Sizing warning"}
          trendUp={Number(avgRr) >= 1.5}
          icon={<AlertTriangle size={20} className={Number(avgRr) >= 1.5 ? "text-amber-500 dark:text-amber-400" : "text-rose-500 dark:text-rose-400"} />}
          className={Number(avgRr) >= 1.5 ? "border-amber-200 dark:border-amber-500/20 shadow-sm dark:shadow-none" : "border-rose-200 dark:border-rose-500/30 shadow-sm dark:shadow-none"}
        />
      </div>

      {/* Equity Curve Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1 shadow-sm dark:shadow-none transition-colors">
        <PnlChart data={displayPnlData} />
      </div>

      {/* Recent Trades Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Recent Trades</h2>
          <Link href="/journal" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors">
            View All Journal Entries <ArrowRight size={14} />
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm dark:shadow-xl transition-colors">
          <div className="overflow-x-auto">
            {recentTrades.length > 0 ? (
              <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
                <thead className="bg-zinc-50 dark:bg-zinc-950/60 text-zinc-700 dark:text-zinc-300 uppercase text-xs border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Asset</th>
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold">Net PnL</th>
                    <th className="px-6 py-4 font-semibold">Pre-Trade Emotion</th>
                    <th className="px-6 py-4 font-semibold">Discipline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                  {recentTrades.slice(0, 5).map((trade) => (
                    <tr key={trade.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{new Date(trade.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-200">{trade.asset}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          trade.orderType === 'Long' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400'
                        }`}>
                          {trade.orderType}
                        </span>
                      </td>
                      <td className={`px-6 py-4 font-mono font-bold ${trade.netPnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-500'}`}>
                        {trade.netPnl >= 0 ? "+" : ""}${trade.netPnl.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-600 dark:text-zinc-400">{trade.preTradeEmotion}</td>
                      <td className="px-6 py-4 text-xs text-amber-500 dark:text-amber-400">★ {trade.disciplineRating}/5</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-zinc-500 dark:text-zinc-400 italic">
                No trades logged yet. Click "+ Log New Trade" to log your first trade!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
