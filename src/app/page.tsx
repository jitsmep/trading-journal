"use client";

import React, { useState, useEffect } from "react";
import { StatCard } from "@/components/StatCard";
import { PnlChart } from "@/components/PnlChart";
import { useTrades } from "@/context/TradesContext";
import { DollarSign, Percent, TrendingUp, AlertTriangle, ArrowRight, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { trades, isLoaded } = useTrades();
  
  // State for balance
  const [startingBalance, setStartingBalance] = useState<number>(10000);

  // 1. Memory Hook: Check browser storage as soon as the dashboard loads
  useEffect(() => {
    const savedBalance = localStorage.getItem("journal_starting_balance");
    if (savedBalance) {
      setStartingBalance(Number(savedBalance));
    }
  }, []);

  // 2. Save Hook: Update state AND save to browser memory whenever user types
  const handleBalanceUpdate = (val: number) => {
    setStartingBalance(val);
    localStorage.setItem("journal_starting_balance", val.toString());
  };

  if (!isLoaded) {
    return (
      <div className="space-y-6 animate-pulse p-4 md:p-0">
        <div className="flex justify-between items-end">
          <div className="h-10 bg-zinc-200 dark:bg-zinc-900 rounded w-1/4" />
          <div className="h-10 bg-zinc-200 dark:bg-zinc-900 rounded w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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

  // Generate Equity Curve Chart Data dynamically using custom starting balance
  let cumulative = startingBalance; 
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
    : [{ date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), balance: startingBalance, netPnl: 0 }];

  return (
    <div className="space-y-6 pb-12 transition-colors duration-300 text-zinc-900 dark:text-zinc-100 p-1 sm:p-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-200 dark:border-zinc-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 tracking-tight">
            Dashboard
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm mt-1">Overview of your real-time trading performance.</p>
        </div>
        
        {/* Dynamic Controls Layout */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Starting Capital Config Box */}
          <div className="flex items-center justify-between sm:justify-start gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 shadow-sm">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-zinc-400" />
              <span className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Start Size:</span>
            </div>
            <div className="relative flex items-center">
              <span className="text-xs font-semibold text-zinc-400 mr-0.5">$</span>
              <input 
                type="number" 
                value={startingBalance} 
                onChange={(e) => handleBalanceUpdate(parseFloat(e.target.value) || 0)} 
                className="w-20 sm:w-24 bg-transparent border-none text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none font-mono text-right sm:text-left"
                placeholder="10000"
              />
            </div>
          </div>

          <Link 
            href="/journal/new" 
            className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-400 dark:hover:bg-emerald-500 text-white dark:text-zinc-950 font-extrabold px-5 py-2.5 rounded-lg transition-all shadow-lg text-xs sm:text-sm hover:scale-[1.02] text-center"
          >
            + Log New Trade
          </Link>
        </div>
      </div>

      {/* Summary Cards: Dynamic grid-cols setup for perfect mobile nesting */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Net PnL"
          value={`$${totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          trend="Overall Balance Change"
          trendUp={totalPnl >= 0}
          icon={<DollarSign size={20} className={totalPnl >= 0 ? "text-emerald-500 dark:text-emerald-400" : "text-rose-600 dark:text-rose-500"} />}
          className={totalPnl >= 0 ? "border-emerald-200 dark:border-emerald-500/20 shadow-sm bg-white dark:bg-zinc-900" : "border-rose-200 dark:border-rose-500/20 shadow-sm bg-white dark:bg-zinc-900"}
        />
        <StatCard
          title="Win Rate"
          value={`${winRate}%`}
          trend={Number(winRate) >= 50 ? "Profitable Strategy" : "Needs risk management"}
          trendUp={Number(winRate) >= 50}
          icon={<Percent size={20} className="text-cyan-500 dark:text-cyan-400" />}
          className="border-cyan-200 dark:border-cyan-500/20 shadow-sm bg-white dark:bg-zinc-900"
        />
        <StatCard
          title="Total Trades"
          value={totalTrades.toString()}
          trend="Logged Sessions"
          trendUp={true}
          icon={<TrendingUp size={20} className="text-purple-500 dark:text-purple-400" />}
          className="border-purple-200 dark:border-purple-500/20 shadow-sm bg-white dark:bg-zinc-900"
        />
        <StatCard
          title="Avg Risk/Reward"
          value={`${avgRr}R`}
          trend={Number(avgRr) >= 1.5 ? "Healthy Ratio" : "Sizing warning"}
          trendUp={Number(avgRr) >= 1.5}
          icon={<AlertTriangle size={20} className={Number(avgRr) >= 1.5 ? "text-amber-500 dark:text-amber-400" : "text-rose-500 dark:text-rose-400"} />}
          className={Number(avgRr) >= 1.5 ? "border-amber-200 dark:border-amber-500/20 shadow-sm bg-white dark:bg-zinc-900" : "border-rose-200 dark:border-rose-500/30 shadow-sm bg-white dark:bg-zinc-900"}
        />
      </div>

      {/* Equity Curve Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1 shadow-sm transition-colors overflow-hidden">
        <PnlChart data={displayPnlData} />
      </div>

      {/* Recent Trades Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Recent Trades</h2>
          <Link href="/journal" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors">
            View All Entries <ArrowRight size={14} />
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm transition-colors">
          <div className="overflow-x-auto w-full">
            {recentTrades.length > 0 ? (
              <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400 min-w-[600px]">
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
              <div className="p-8 text-center text-zinc-500 dark:text-zinc-400 italic text-sm">
                No trades logged yet. Click "+ Log New Trade" to log your first trade!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
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

  // Generate Equity Curve Chart Data dynamically using custom starting balance
  let cumulative = startingBalance; 
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
    : [{ date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), balance: startingBalance, netPnl: 0 }];

  return (
    <div className="space-y-6 pb-12 transition-colors duration-300 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-200 dark:border-zinc-800 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 tracking-tight">
            Dashboard
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Overview of your real-time trading performance.</p>
        </div>
        
        {/* Dynamic Controls Layout */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Starting Capital Config Box */}
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 shadow-sm">
            <Wallet size={16} className="text-zinc-400" />
            <span className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Start Size:</span>
            <div className="relative flex items-center">
              <span className="text-xs font-semibold text-zinc-400 mr-0.5">$</span>
              <input 
                type="number" 
                value={startingBalance} 
                onChange={(e) => handleBalanceUpdate(parseFloat(e.target.value) || 0)} 
                className="w-24 bg-transparent border-none text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none font-mono"
                placeholder="10000"
              />
            </div>
          </div>

          <Link 
            href="/journal/new" 
            className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-400 dark:hover:bg-emerald-500 text-white dark:text-zinc-950 font-extrabold px-5 py-2.5 rounded-lg transition-all shadow-lg text-sm hover:scale-[1.02] ml-auto md:ml-0"
          >
            + Log New Trade
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Net PnL"
          value={`$${totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          trend="Overall Balance Change"
          trendUp={totalPnl >= 0}
          icon={<DollarSign size={20} className={totalPnl >= 0 ? "text-emerald-500 dark:text-emerald-400" : "text-rose-600 dark:text-rose-500"} />}
          className={totalPnl >= 0 ? "border-emerald-200 dark:border-emerald-500/20 shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.02)] bg-white dark:bg-zinc-900" : "border-rose-200 dark:border-rose-500/20 shadow-sm dark:shadow-none bg-white dark:bg-zinc-900"}
        />
        <StatCard
          title="Win Rate"
          value={`${winRate}%`}
          trend={Number(winRate) >= 50 ? "Profitable Strategy" : "Needs risk management"}
          trendUp={Number(winRate) >= 50}
          icon={<Percent size={20} className="text-cyan-500 dark:text-cyan-400" />}
          className="border-cyan-200 dark:border-cyan-500/20 shadow-sm dark:shadow-none bg-white dark:bg-zinc-900"
        />
        <StatCard
          title="Total Trades"
          value={totalTrades.toString()}
          trend="Logged Sessions"
          trendUp={true}
          icon={<TrendingUp size={20} className="text-purple-500 dark:text-purple-400" />}
          className="border-purple-200 dark:border-purple-500/20 shadow-sm dark:shadow-none bg-white dark:bg-zinc-900"
        />
        <StatCard
          title="Avg Risk/Reward"
          value={`${avgRr}R`}
          trend={Number(avgRr) >= 1.5 ? "Healthy Ratio" : "Sizing warning"}
          trendUp={Number(avgRr) >= 1.5}
          icon={<AlertTriangle size={20} className={Number(avgRr) >= 1.5 ? "text-amber-500 dark:text-amber-400" : "text-rose-500 dark:text-rose-400"} />}
          className={Number(avgRr) >= 1.5 ? "border-amber-200 dark:border-amber-500/20 shadow-sm dark:shadow-none bg-white dark:bg-zinc-900" : "border-rose-200 dark:border-rose-500/30 shadow-sm dark:shadow-none bg-white dark:bg-zinc-900"}
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
