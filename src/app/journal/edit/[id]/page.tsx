"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTrades } from "@/context/TradesContext";
import { ArrowLeft, CheckCircle, TrendingUp, TrendingDown, Star } from "lucide-react";
import Link from "next/link";
import { Market, OrderType, Sentiment } from "@/lib/types";

const PRESET_EMOTIONS_PRE = ["Calm", "Confident", "Fearful of Missing Out (FOMO)", "Anxious", "Impatient", "Excited", "Greedy"];
const PRESET_EMOTIONS_POST = ["Disciplined", "Relieved", "Frustrated", "Satisfied", "Angry", "Greedy"];
const PRESET_MISTAKES = ["#FOMO", "#EarlyExit", "#ChasedThePump", "#NoStopLoss", "#Overleveraged", "#RevengeTrading", "#FightingTheTrend", "#AveragingDown"];

export default function EditTradePage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const { trades, updateTrade, isLoaded } = useTrades();
  
  // Fully loaded input states
  const [market, setMarket] = useState<string>("Crypto");
  const [asset, setAsset] = useState("");
  const [orderType, setOrderType] = useState<string>("Long");
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [positionSize, setPositionSize] = useState("");
  const [fees, setFees] = useState("0");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [date, setDate] = useState("");
  const [marketSentiment, setMarketSentiment] = useState<string>("Bullish");
  const [newsCatalyst, setNewsCatalyst] = useState("");
  const [preTradeEmotion, setPreTradeEmotion] = useState("Calm");
  const [postTradeEmotion, setPostTradeEmotion] = useState("Disciplined");
  const [disciplineRating, setDisciplineRating] = useState(5);
  const [notes, setNotes] = useState("");
  const [chartUrl, setChartUrl] = useState("");
  const [mistakeTags, setMistakeTags] = useState<string[]>([]);
  const [customMistake, setCustomMistake] = useState("");

  useEffect(() => {
    if (isLoaded && trades.length > 0 && id) {
      const trade = trades.find(t => t.id === id);
      if (trade) {
        setMarket(trade.market);
        setAsset(trade.asset);
        setOrderType(trade.orderType);
        setEntryPrice(trade.entryPrice.toString());
        setExitPrice(trade.exitPrice.toString());
        setPositionSize(trade.positionSize.toString());
        setFees(trade.fees.toString());
        setStopLoss(trade.stopLoss?.toString() || "");
        setTakeProfit(trade.takeProfit?.toString() || "");
        setDate(trade.date || "");
        setMarketSentiment(trade.marketSentiment || "Bullish");
        setNewsCatalyst(trade.newsCatalyst || "");
        setPreTradeEmotion(trade.preTradeEmotion || "Calm");
        setPostTradeEmotion(trade.postTradeEmotion || "Disciplined");
        setDisciplineRating(trade.disciplineRating || 5);
        setNotes(trade.notes || "");
        setChartUrl(trade.chartUrl || "");
        setMistakeTags(trade.mistakeTags || []);
      }
    }
  }, [id, trades, isLoaded]);

  if (!isLoaded) return <div className="p-10 text-center text-sm font-semibold animate-pulse">Syncing Database Matrix...</div>;

  const handleToggleMistake = (tag: string) => setMistakeTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  const handleAddCustomMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (customMistake.trim()) {
      const cleanTag = customMistake.trim().startsWith("#") ? customMistake.trim() : `#${customMistake.trim()}`;
      if (!mistakeTags.includes(cleanTag)) setMistakeTags([...mistakeTags, cleanTag]);
      setCustomMistake("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset.trim()) return alert("Asset symbol is required.");

    const numEntry = parseFloat(entryPrice) || 0;
    const numExit = parseFloat(exitPrice) || 0;
    const numSize = parseFloat(positionSize) || 0;
    const numFees = parseFloat(fees) || 0;
    const numSL = parseFloat(stopLoss) || 0;
    const numTP = parseFloat(takeProfit) || 0;

    let grossPnl = 0;
    if (numEntry > 0 && numExit > 0 && numSize > 0) {
      grossPnl = orderType === "Long" ? (numExit - numEntry) * numSize : (numEntry - numExit) * numSize;
    }
    const netPnl = grossPnl - numFees;
    const roi = numEntry > 0 && numSize > 0 ? (netPnl / (numEntry * numSize)) * 100 : 0;

    let riskAmount = 0, rewardAmount = 0, rrRatio = 0;
    if (numEntry > 0) {
      if (orderType === "Long") {
        if (numSL > 0 && numSL < numEntry) riskAmount = (numEntry - numSL) * numSize;
        if (numTP > numEntry) rewardAmount = (numTP - numEntry) * numSize;
      } else {
        if (numSL > numEntry) riskAmount = (numSL - numEntry) * numSize;
        if (numTP > 0 && numTP < numEntry) rewardAmount = (numEntry - numTP) * numSize;
      }
      if (riskAmount > 0 && rewardAmount > 0) rrRatio = rewardAmount / riskAmount;
    }

    updateTrade({
      id: id,
      date,
      market: market as Market,
      asset: asset.toUpperCase(),
      orderType: orderType as OrderType,
      entryPrice: numEntry,
      exitPrice: numExit,
      positionSize: numSize,
      fees: numFees,
      takeProfit: numTP,
      stopLoss: numSL,
      grossPnl,
      netPnl,
      rrRatio: rrRatio || 1.0,
      percentageGain: roi,
      preTradeEmotion,
      postTradeEmotion,
      disciplineRating,
      notes,
      chartUrl: chartUrl || undefined,
      marketSentiment: marketSentiment as Sentiment,
      newsCatalyst: newsCatalyst || undefined,
      mistakeTags
    });

    router.push("/journal");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <Link href="/journal" className="p-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Edit Trade Parameters</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Modify execution metrics, setups, risk properties, and psychology logs.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl space-y-6 shadow-sm">
        
        {/* Section 1: Asset Specs */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">1. Core Setup & Assets</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-zinc-500 block mb-1.5">Market Type</label>
              <select value={market} onChange={(e) => setMarket(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500">
                <option value="Crypto">Crypto</option>
                <option value="Forex">Forex</option>
                <option value="Stocks">Stocks</option>
                <option value="Options">Options</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-zinc-500 block mb-1.5">Asset Symbol</label>
              <input type="text" value={asset} onChange={(e) => setAsset(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs uppercase text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500 font-medium" required />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-zinc-500 block mb-1.5">Direction</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setOrderType("Long")} className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${orderType === "Long" ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "border-zinc-200 dark:border-zinc-800 text-zinc-400"}`}><TrendingUp size={12} /> LONG</button>
                <button type="button" onClick={() => setOrderType("Short")} className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${orderType === "Short" ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400" : "border-zinc-200 dark:border-zinc-800 text-zinc-400"}`}><TrendingDown size={12} /> SHORT</button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Math Parameters */}
        <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-800/60 pt-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">2. Transaction Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-zinc-500 block mb-1.5">Entry Price</label>
              <input type="number" step="any" value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs font-mono text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500" required />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-zinc-500 block mb-1.5">Exit Price</label>
              <input type="number" step="any" value={exitPrice} onChange={(e) => setExitPrice(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs font-mono text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500" required />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-zinc-500 block mb-1.5">Position Size</label>
              <input type="number" step="any" value={positionSize} onChange={(e) => setPositionSize(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs font-mono text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500" required />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-zinc-500 block mb-1.5">Fees Paid</label>
              <input type="number" step="any" value={fees} onChange={(e) => setFees(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs font-mono text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500" required />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-zinc-500 block mb-1.5">Stop Loss</label>
              <input type="number" step="any" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs font-mono text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-zinc-500 block mb-1.5">Take Profit</label>
              <input type="number" step="any" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs font-mono text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500" />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="text-xs font-bold uppercase text-zinc-500 block mb-1.5">Date String</label>
              <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500" />
            </div>
          </div>
        </div>

        {/* Section 3: Psychology & Strategy */}
        <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-800/60 pt-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">3. Psychology & Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-zinc-500 block mb-1.5">Pre-Trade Emotion</label>
              <select value={preTradeEmotion} onChange={(e) => setPreTradeEmotion(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500">
                {PRESET_EMOTIONS_PRE.map(emo => <option key={emo} value={emo}>{emo}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-zinc-500 block mb-1.5">Post-Trade Emotion</label>
              <select value={postTradeEmotion} onChange={(e) => setPostTradeEmotion(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500">
                {PRESET_EMOTIONS_POST.map(emo => <option key={emo} value={emo}>{emo}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-zinc-500 tracking-wider mb-2">Discipline Rating: <span className="text-emerald-500 font-mono">{disciplineRating}/5</span></label>
            <div className="flex gap-2 p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg w-fit">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setDisciplineRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                  <Star size={20} className={star <= disciplineRating ? "fill-amber-400 text-amber-400" : "text-zinc-300 dark:text-zinc-700"} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-zinc-500 block mb-1.5">Mistake Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRESET_MISTAKES.map(tag => (
                <button type="button" key={tag} onClick={() => handleToggleMistake(tag)} className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${mistakeTags.includes(tag) ? "bg-rose-500/10 border-rose-400 text-rose-600 dark:text-rose-400 font-bold" : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-400"}`}>{tag}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-zinc-500 block mb-1.5">Retrospective Notes</label>
            <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500 resize-none font-sans" placeholder="Analyze what happened..." />
          </div>
        </div>

        <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-extrabold p-3 rounded-lg text-xs shadow-md transition-all flex justify-center gap-1.5 hover:opacity-90">
          <CheckCircle size={14} /> Commit Structural Log Overwrite
        </button>
      </form>
    </div>
  );
}
