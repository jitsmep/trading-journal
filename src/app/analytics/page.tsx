"use client";

import React from "react";
import { StatCard } from "@/components/StatCard";
import { useTrades } from "@/context/TradesContext";
import { Target, BrainCircuit, CalendarDays, Frown } from 'lucide-react';

export default function AnalyticsPage() {
  const { trades, isLoaded } = useTrades();

  if (!isLoaded) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-zinc-200 dark:bg-zinc-900 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-zinc-200 dark:bg-zinc-900 rounded" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-zinc-200 dark:bg-zinc-900 rounded" />
          <div className="h-64 bg-zinc-200 dark:bg-zinc-900 rounded" />
        </div>
      </div>
    );
  }

  // 1. Mistake Frequencies
  const allMistakes = trades.flatMap(t => t.mistakeTags || []);
  const mistakeCounts = allMistakes.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedMistakes = Object.entries(mistakeCounts).sort((a, b) => b[1] - a[1]);

  // 2. Best Performing Asset
  const assetPnls: Record<string, number> = {};
  const assetCounts: Record<string, number> = {};
  
  trades.forEach(t => {
    assetPnls[t.asset] = (assetPnls[t.asset] || 0) + t.netPnl;
    assetCounts[t.asset] = (assetCounts[t.asset] || 0) + 1;
  });

  let bestAsset = "None";
  let bestAssetReturn = 0;
  let maxAssetPnl = -Infinity;

  Object.entries(assetPnls).forEach(([asset, pnl]) => {
    if (pnl > maxAssetPnl) {
      maxAssetPnl = pnl;
      bestAsset = asset;
      // Find average percentage return for this asset
      const assetTrades = trades.filter(t => t.asset === asset);
      const avgReturn = assetTrades.reduce((acc, t) => acc + t.percentageGain, 0) / assetTrades.length;
      bestAssetReturn = avgReturn;
    }
  });

  // 3. Avg Discipline Rating
  const avgDiscipline = trades.length > 0
    ? (trades.reduce((acc, t) => acc + t.disciplineRating, 0) / trades.length).toFixed(1)
    : "0.0";

  // 4. Most Profitable Day
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayPnls: Record<number, number> = {};

  trades.forEach(t => {
    const day = new Date(t.date).getDay();
    dayPnls[day] = (dayPnls[day] || 0) + t.netPnl;
  });

  let bestDayName = "None";
  let maxDayPnl = -Infinity;

  Object.entries(dayPnls).forEach(([dayStr, pnl]) => {
    const d = Number(dayStr);
    if (pnl > maxDayPnl) {
      maxDayPnl = pnl;
      bestDayName = dayNames[d];
    }
  });

  // 5. Emotion Correlation Calculations
  const getEmotionStats = (keyword: string) => {
    const relevantTrades = trades.filter(t => 
      t.preTradeEmotion.toLowerCase().includes(keyword.toLowerCase())
    );
    if (relevantTrades.length === 0) return { winRate: 0, count: 0 };
    const wins = relevantTrades.filter(t => t.netPnl > 0).length;
    return {
      winRate: Math.round((wins / relevantTrades.length) * 100),
      count: relevantTrades.length
    };
  };

  const calmStats = getEmotionStats("Calm");
  const confidentStats = getEmotionStats("Confident");
  const fomoStats = getEmotionStats("FOMO");

  return (
    <div className="space-y-6 pb-12 transition-colors duration-300">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 tracking-tight">
          Analytics & Insights
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Deep dive into your performance patterns, psychological edges, and rules audit.</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Most Frequent Mistake"
          value={sortedMistakes.length > 0 ? sortedMistakes[0][0] : "None logged"}
          trend={sortedMistakes.length > 0 ? `${sortedMistakes[0][1]} instances` : "Perfect execution"}
          trendUp={sortedMistakes.length === 0}
          icon={<Frown size={20} className="text-rose-500 dark:text-rose-400" />}
          className="border-rose-200 dark:border-rose-500/20 bg-white dark:bg-zinc-900"
        />
        <StatCard
          title="Best Performing Asset"
          value={bestAsset}
          trend={bestAsset !== "None" ? `${bestAssetReturn >= 0 ? "+" : ""}${bestAssetReturn.toFixed(2)}% Avg ROI` : "N/A"}
          trendUp={bestAssetReturn >= 0}
          icon={<Target size={20} className="text-emerald-500 dark:text-emerald-400" />}
          className="border-emerald-200 dark:border-emerald-500/20 bg-white dark:bg-zinc-900"
        />
        <StatCard
          title="Avg Discipline Rating"
          value={`${avgDiscipline} / 5.0`}
          trend={Number(avgDiscipline) >= 4.0 ? "Rules Compliant" : "Rules Slippage"}
          trendUp={Number(avgDiscipline) >= 4.0}
          icon={<BrainCircuit size={20} className="text-cyan-500 dark:text-cyan-400" />}
          className="border-cyan-200 dark:border-cyan-500/20 bg-white dark:bg-zinc-900"
        />
        <StatCard
          title="Most Profitable Day"
          value={bestDayName}
          trend={bestDayName !== "None" ? `Net return: $${maxDayPnl.toFixed(2)}` : "N/A"}
          trendUp={maxDayPnl >= 0}
          icon={<CalendarDays size={20} className="text-purple-500 dark:text-purple-400" />}
          className="border-purple-200 dark:border-purple-500/20 bg-white dark:bg-zinc-900"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mistake Tracker */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm dark:shadow-xl transition-colors">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1 tracking-tight">Mistake Frequency Index</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Focus on eliminating these behavior leaks to boost performance.</p>
          
          {sortedMistakes.length > 0 ? (
            <div className="space-y-3">
              {sortedMistakes.map(([tag, count]) => (
                <div key={tag} className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800/80">
                  <span className="text-rose-600 dark:text-rose-400 font-bold text-xs">{tag}</span>
                  <span className="text-zinc-700 dark:text-zinc-300 font-semibold bg-white dark:bg-zinc-900 px-3 py-1 border border-zinc-200 dark:border-zinc-800 rounded text-xs shadow-sm">
                    {count} {count === 1 ? 'occurrence' : 'occurrences'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-500 italic bg-zinc-50 dark:bg-zinc-950/40 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
              No trading mistakes logged yet. Keep following your rules!
            </div>
          )}
        </div>

        {/* Emotion Correlation */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm dark:shadow-xl transition-colors">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1 tracking-tight">Mindset vs Win Rate Correlation</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Analysis of how your psychological state prior to entries affects outcomes.</p>
          
          {trades.length > 0 ? (
            <div className="space-y-5">
              {/* Calm */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-zinc-700 dark:text-zinc-300">Calm & Centered</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{calmStats.winRate}% Win Rate <span className="text-zinc-500 font-normal">({calmStats.count} trades)</span></span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-950 rounded-full h-2 border border-zinc-200 dark:border-zinc-800/80 overflow-hidden">
                  <div 
                    className="bg-emerald-500 dark:bg-emerald-400 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${calmStats.count > 0 ? calmStats.winRate : 0}%` }}
                  />
                </div>
              </div>

              {/* Confident */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-zinc-700 dark:text-zinc-300">Confident / High conviction</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{confidentStats.winRate}% Win Rate <span className="text-zinc-500 font-normal">({confidentStats.count} trades)</span></span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-950 rounded-full h-2 border border-zinc-200 dark:border-zinc-800/80 overflow-hidden">
                  <div 
                    className="bg-emerald-500 dark:bg-emerald-400 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${confidentStats.count > 0 ? confidentStats.winRate : 0}%` }}
                  />
                </div>
              </div>

              {/* FOMO */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-zinc-700 dark:text-zinc-300">Fear of Missing Out (FOMO) / Greed</span>
                  <span className="text-rose-600 dark:text-rose-450 font-bold">{fomoStats.winRate}% Win Rate <span className="text-zinc-500 font-normal">({fomoStats.count} trades)</span></span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-950 rounded-full h-2 border border-zinc-200 dark:border-zinc-800/80 overflow-hidden">
                  <div 
                    className="bg-rose-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${fomoStats.count > 0 ? fomoStats.winRate : 0}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-500 italic bg-zinc-50 dark:bg-zinc-950/40 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
              Add trades to generate correlation metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
