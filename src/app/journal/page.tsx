"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Trash2, 
  Search, 
  SlidersHorizontal,
  ChevronDown, 
  ChevronUp,
  ExternalLink,
  Tag,
  Calendar,
  DollarSign
} from "lucide-react";
import { useTrades } from "@/context/TradesContext";
import { Trade } from "@/lib/types";

export default function JournalPage() {
  const { trades, deleteTrade, isLoaded } = useTrades();
  
  // Search, Filter, Sort States
  const [search, setSearch] = useState("");
  const [marketFilter, setMarketFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc"); // date-desc, date-asc, pnl-desc, pnl-asc, rating-desc
  
  // Expandable row state
  const [expandedTradeId, setExpandedTradeId] = useState<string | null>(null);

  if (!isLoaded) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-10 bg-zinc-900 rounded w-1/4" />
          <div className="h-10 bg-zinc-900 rounded w-32" />
        </div>
        <div className="h-14 bg-zinc-900 rounded-xl" />
        <div className="h-96 bg-zinc-900 rounded-xl" />
      </div>
    );
  }

  // Toggle row expansion
  const toggleRow = (id: string) => {
    if (expandedTradeId === id) {
      setExpandedTradeId(null);
    } else {
      setExpandedTradeId(id);
    }
  };

  // Filter and Sort Logic
  const filteredTrades = trades
    .filter((trade) => {
      const matchesSearch = trade.asset.toLowerCase().includes(search.toLowerCase());
      const matchesMarket = marketFilter === "All" || trade.market === marketFilter;
      return matchesSearch && matchesMarket;
    })
    .sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === "date-asc") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === "pnl-desc") {
        return b.netPnl - a.netPnl;
      }
      if (sortBy === "pnl-asc") {
        return a.netPnl - b.netPnl;
      }
      if (sortBy === "rating-desc") {
        return b.disciplineRating - a.disciplineRating;
      }
      return 0;
    });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight">
            Trading Journal
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Review, filter, and audit your historical trade logs.</p>
        </div>
        <Link 
          href="/journal/new" 
          className="flex items-center gap-2 bg-emerald-400 hover:bg-emerald-500 text-zinc-950 font-extrabold px-4 py-2.5 rounded-lg transition-all shadow-lg text-sm hover:scale-[1.02]"
        >
          <Plus size={18} /> New Trade
        </Link>
      </div>

      {/* Advanced Control Bar */}
      <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-md">
        
        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3 top-3.5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search symbol (e.g. BTC)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 pl-10 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors uppercase font-medium"
          />
        </div>

        {/* Market Filter Tabs */}
        <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800 w-full md:w-auto overflow-x-auto gap-1">
          {["All", "Crypto", "Forex", "Stocks", "Options"].map((m) => (
            <button
              key={m}
              onClick={() => setMarketFilter(m)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                marketFilter === m
                  ? "bg-zinc-800 text-emerald-400 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
          <SlidersHorizontal size={14} className="text-zinc-500" />
          <span className="text-xs text-zinc-500 font-semibold uppercase">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-medium rounded-lg p-2 focus:outline-none focus:border-emerald-500 transition-colors"
          >
            <option value="date-desc">Newest Date</option>
            <option value="date-asc">Oldest Date</option>
            <option value="pnl-desc">Highest PnL</option>
            <option value="pnl-asc">Lowest PnL</option>
            <option value="rating-desc">Discipline Rating</option>
          </select>
        </div>
      </div>

      {/* Main Journal Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                <th className="p-4 pl-6">Date</th>
                <th className="p-4">Asset</th>
                <th className="p-4">Market</th>
                <th className="p-4">Type</th>
                <th className="p-4">Net PnL</th>
                <th className="p-4">ROI %</th>
                <th className="p-4">Discipline</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
              {filteredTrades.length > 0 ? (
                filteredTrades.map((trade) => {
                  const isExpanded = expandedTradeId === trade.id;
                  return (
                    <React.Fragment key={trade.id}>
                      <tr 
                        onClick={() => toggleRow(trade.id)}
                        className={`hover:bg-zinc-800/20 transition-all cursor-pointer ${
                          isExpanded ? "bg-zinc-850/45 border-l-2 border-emerald-400" : ""
                        }`}
                      >
                        <td className="p-4 pl-6 font-mono text-xs text-zinc-400">
                          {new Date(trade.date).toLocaleDateString()}
                        </td>
                        <td className="p-4 font-extrabold text-zinc-100 flex items-center gap-1.5">
                          {trade.asset}
                          <span className="text-[10px] text-zinc-500 font-normal">({trade.market})</span>
                        </td>
                        <td className="p-4 text-xs font-semibold text-zinc-400">
                          {trade.market}
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded tracking-wider uppercase ${
                            trade.orderType === 'Long' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {trade.orderType}
                          </span>
                        </td>
                        <td className={`p-4 font-mono font-bold ${
                          trade.netPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {trade.netPnl >= 0 ? "+" : ""}${trade.netPnl.toFixed(2)}
                        </td>
                        <td className={`p-4 font-mono text-xs ${
                          trade.percentageGain >= 0 ? 'text-emerald-500/80' : 'text-rose-500/80'
                        }`}>
                          {trade.percentageGain >= 0 ? "+" : ""}{trade.percentageGain.toFixed(2)}%
                        </td>
                        <td className="p-4 text-xs text-amber-400 font-bold">
                          ★ {trade.disciplineRating}/5
                        </td>
                        <td className="p-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => toggleRow(trade.id)}
                              className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded transition-colors"
                              title="Toggle Details"
                            >
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete this ${trade.asset} trade?`)) {
                                  deleteTrade(trade.id);
                                }
                              }}
                              className="text-zinc-650 hover:text-rose-400 p-1.5 rounded hover:bg-rose-500/5 transition-colors"
                              title="Delete Trade"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Details Panel */}
                      {isExpanded && (
                        <tr className="bg-zinc-950/40 border-b border-zinc-800">
                          <td colSpan={8} className="p-6 pl-10 pr-6 text-sm text-zinc-300">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                              
                              {/* Execution specifics */}
                              <div className="md:col-span-4 space-y-3 border-r border-zinc-800/80 pr-4">
                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                                  <SlidersHorizontal size={12} /> Execution Details
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                                  <div>
                                    <span className="text-zinc-500 block">Entry Price</span>
                                    <span className="text-zinc-200 font-semibold">${trade.entryPrice.toLocaleString()}</span>
                                  </div>
                                  <div>
                                    <span className="text-zinc-500 block">Exit Price</span>
                                    <span className="text-zinc-200 font-semibold">${trade.exitPrice.toLocaleString()}</span>
                                  </div>
                                  <div>
                                    <span className="text-zinc-500 block">Position Size</span>
                                    <span className="text-zinc-200 font-semibold">{trade.positionSize.toLocaleString()} units</span>
                                  </div>
                                  <div>
                                    <span className="text-zinc-500 block">Fees paid</span>
                                    <span className="text-zinc-400">${trade.fees.toFixed(2)}</span>
                                  </div>
                                  <div>
                                    <span className="text-zinc-500 block">Stop Loss</span>
                                    <span className="text-rose-400 font-semibold">{trade.stopLoss > 0 ? `$${trade.stopLoss.toLocaleString()}` : "None"}</span>
                                  </div>
                                  <div>
                                    <span className="text-zinc-500 block">Take Profit</span>
                                    <span className="text-emerald-400 font-semibold">{trade.takeProfit > 0 ? `$${trade.takeProfit.toLocaleString()}` : "None"}</span>
                                  </div>
                                </div>
                                {trade.chartUrl && (
                                  <a 
                                    href={trade.chartUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-350 hover:underline pt-2"
                                  >
                                    View Trade Chart <ExternalLink size={12} />
                                  </a>
                                )}
                              </div>

                              {/* Psychology & emotions */}
                              <div className="md:col-span-4 space-y-3 border-r border-zinc-800/80 pr-4">
                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                                  <Tag size={12} /> Mindset & Emotion
                                </h4>
                                <div className="space-y-2 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">Pre-trade State:</span>
                                    <span className="font-semibold text-zinc-200 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">{trade.preTradeEmotion}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">Post-trade State:</span>
                                    <span className="font-semibold text-zinc-200 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">{trade.postTradeEmotion}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">Market Sentiment:</span>
                                    <span className="font-semibold text-zinc-200">{trade.marketSentiment}</span>
                                  </div>
                                  {trade.newsCatalyst && (
                                    <div className="flex justify-between">
                                      <span className="text-zinc-500">News Catalyst:</span>
                                      <span className="font-medium text-cyan-400">{trade.newsCatalyst}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Mistake tags list */}
                                {trade.mistakeTags && trade.mistakeTags.length > 0 && (
                                  <div className="pt-2">
                                    <span className="text-zinc-500 text-xs block mb-1.5">Mistake Tags logged:</span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {trade.mistakeTags.map((tag) => (
                                        <span 
                                          key={tag} 
                                          className="text-[10px] bg-rose-500/10 border border-rose-500/25 text-rose-450 px-2 py-0.5 rounded-full font-bold"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Retrospective / Notes */}
                              <div className="md:col-span-4 space-y-3">
                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                                  <Calendar size={12} /> Retrospective Notes
                                </h4>
                                <div className="bg-zinc-900/50 border border-zinc-850 p-3 rounded-lg text-xs leading-relaxed text-zinc-300 italic min-h-[90px]">
                                  {trade.notes || "No notes logged for this session."}
                                </div>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-zinc-500 italic">
                    No trades match the active filter or search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}