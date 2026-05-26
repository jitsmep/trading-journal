"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTrades } from "@/context/TradesContext";
import { 
  ArrowLeft, 
  Layers, 
  Globe, 
  BrainCircuit, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle2, 
  BadgePercent 
} from "lucide-react";
import Link from "next/link";

export default function NewTradePage() {
  const router = useRouter();
  const { addTrade } = useTrades();
  const [step, setStep] = useState(1);

  // Form Field States
  const [market, setMarket] = useState("Crypto");
  const [asset, setAsset] = useState("");
  const [orderType, setOrderType] = useState<"Long" | "Short">("Long");
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [positionSize, setPositionSize] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [fees, setFees] = useState("");
  
  // Step 2 & 3 States
  const [marketSentiment, setMarketSentiment] = useState("Bullish");
  const [newsCatalyst, setNewsCatalyst] = useState("");
  const [preTradeEmotion, setPreTradeEmotion] = useState("Calm");
  const [postTradeEmotion, setPostTradeEmotion] = useState("Satisfied");
  const [disciplineRating, setDisciplineRating] = useState(5);
  const [notes, setNotes] = useState("");
  const [mistakeTags, setMistakeTags] = useState<string[]>([]);

  // Real-time calculations
  const entry = Number(entryPrice) || 0;
  const exit = Number(exitPrice) || 0;
  const size = Number(positionSize) || 0;
  const feePaid = Number(fees) || 0;
  const sl = Number(stopLoss) || 0;
  const tp = Number(takeProfit) || 0;

  let grossReturn = 0;
  if (entry > 0 && exit > 0 && size > 0) {
    if (orderType === "Long") {
      grossReturn = (exit - entry) * size;
    } else {
      grossReturn = (entry - exit) * size;
    }
  }
  const netPnl = grossReturn - feePaid;
  const roi = entry > 0 ? (netPnl / (entry * size)) * 100 : 0;

  // Risk Reward calculations
  const riskPerUnit = orderType === "Long" ? entry - sl : sl - entry;
  const rewardPerUnit = orderType === "Long" ? tp - entry : entry - tp;
  const totalRisk = sl > 0 ? riskPerUnit * size : 0;
  const totalReward = tp > 0 ? rewardPerUnit * size : 0;
  const rrRatio = totalRisk > 0 ? (totalReward / totalRisk).toFixed(2) : "undefined";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset) return alert("Please specify an asset symbol!");

    addTrade({
      date: new Date().toISOString().split('T')[0],
      market,
      asset: asset.toUpperCase(),
      orderType,
      entryPrice: entry,
      exitPrice: exit,
      positionSize: size,
      stopLoss: sl,
      takeProfit: tp,
      fees: feePaid,
      netPnl,
      percentageGain: roi,
      rrRatio: sl > 0 && tp > 0 ? Number(rrRatio) : 0,
      marketSentiment,
      newsCatalyst,
      preTradeEmotion,
      postTradeEmotion,
      disciplineRating,
      notes,
      mistakeTags
    });

    router.push("/journal");
  };

  const toggleMistakeTag = (tag: string) => {
    setMistakeTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 transition-colors duration-300 text-zinc-900 dark:text-zinc-100">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/journal" className="p-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Log Execution Parameters</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Audit transaction mechanics, macro contexts, and psychological edges.</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Wizard Container */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-6">
          
          {/* Wizard Header Tabs */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider pb-3 gap-4">
            <button type="button" onClick={() => setStep(1)} className={`pb-1 transition-colors flex items-center gap-1.5 ${step === 1 ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}`}>
              <Layers size={14} /> 1. Setup & Order
            </button>
            <button type="button" onClick={() => setStep(2)} className={`pb-1 transition-colors flex items-center gap-1.5 ${step === 2 ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}`}>
              <Globe size={14} /> 2. Market Context
            </button>
            <button type="button" onClick={() => setStep(3)} className={`pb-1 transition-colors flex items-center gap-1.5 ${step === 3 ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}`}>
              <BrainCircuit size={14} /> 3. Psychology
            </button>
          </div>

          {/* STEP 1: ORDER DETAILS */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Market Type</label>
                  <select value={market} onChange={(e) => setMarket(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500">
                    <option>Crypto</option>
                    <option>Forex</option>
                    <option>Stocks</option>
                    <option>Options</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Asset Symbol</label>
                  <input type="text" placeholder="e.g. SOL" value={asset} onChange={(e) => setAsset(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 uppercase focus:outline-none focus:border-emerald-500 placeholder-zinc-400" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Order Direction</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setOrderType("Long")} className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${orderType === "Long" ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-500"}`}>
                    <TrendingUp size={14} /> LONG (Buy)
                  </button>
                  <button type="button" onClick={() => setOrderType("Short")} className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${orderType === "Short" ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400" : "border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-500"}`}>
                    <TrendingDown size={14} /> SHORT (Sell)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Entry Price</label>
                  <input type="number" step="any" placeholder="0.00" value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Exit Price</label>
                  <input type="number" step="any" placeholder="0.00" value={exitPrice} onChange={(e) => setExitPrice(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Position Size</label>
                  <input type="number" placeholder="Units" value={positionSize} onChange={(e) => setPositionSize(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Stop Loss</label>
                  <input type="number" step="any" placeholder="0.00" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Take Profit</label>
                  <input type="number" step="any" placeholder="0.00" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Fees & Comm.</label>
                  <input type="number" step="any" placeholder="0.00" value={fees} onChange={(e) => setFees(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500" />
                </div>
              </div>

              <button type="button" onClick={() => setStep(2)} className="w-full bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold p-3 rounded-lg text-xs mt-2 transition-all">
                Next: Market Context →
              </button>
            </div>
          )}

          {/* STEP 2: CONTEXTS */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Market Sentiment</label>
                  <select value={marketSentiment} onChange={(e) => setMarketSentiment(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500">
                    <option>Bullish</option>
                    <option>Bearish</option>
                    <option>Neutral / Ranging</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">News Catalyst</label>
                  <input type="text" placeholder="e.g. CPI Release, FOMC" value={newsCatalyst} onChange={(e) => setNewsCatalyst(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500 placeholder-zinc-400" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Behavioral Errors / Mistake Tags</label>
                <div className="flex flex-wrap gap-2">
                  {["#FOMO", "#ChasedThePump", "#Overleveraged", "#EarlyExit", "#StoppedOutTooEarly", "#RevengeTrade"].map((tag) => {
                    const selected = mistakeTags.includes(tag);
                    return (
                      <button type="button" key={tag} onClick={() => toggleMistakeTag(tag)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${selected ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/40 font-bold" : "border-zinc-200 dark:border-zinc-800 text-zinc-400"}`}>
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <button type="button" onClick={() => setStep(1)} className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold p-3 rounded-lg text-xs hover:bg-zinc-200 transition-all">
                  ← Back to Order
                </button>
                <button type="button" onClick={() => setStep(3)} className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold p-3 rounded-lg text-xs hover:bg-zinc-800 transition-all">
                  Next: Psychology →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PSYCHOLOGY & NOTES */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Pre-Trade Emotion</label>
                  <select value={preTradeEmotion} onChange={(e) => setPreTradeEmotion(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500">
                    <option>Calm</option>
                    <option>Anxious</option>
                    <option>Greedy / FOMO</option>
                    <option>Confident</option>
                    <option>Frustrated</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Post-Trade Emotion</label>
                  <select value={postTradeEmotion} onChange={(e) => setPostTradeEmotion(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500">
                    <option>Satisfied</option>
                    <option>Regretful</option>
                    <option>Relieved</option>
                    <option>Angry</option>
                    <option>Neutral</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block flex justify-between mb-1.5">
                  <span>Discipline Compliance Audit</span>
                  <span className="text-emerald-500 dark:text-emerald-400 font-mono">{disciplineRating} / 5</span>
                </label>
                <input type="range" min="1" max="5" value={disciplineRating} onChange={(e) => setDisciplineRating(Number(e.target.value))} className="w-full accent-emerald-500 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Retrospective Notes</label>
                <textarea rows={4} placeholder="Log structural session entry triggers, mistakes or execution notes..." value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500 placeholder-zinc-400 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <button type="button" onClick={() => setStep(2)} className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold p-3 rounded-lg text-xs hover:bg-zinc-200 transition-all">
                  ← Back to Context
                </button>
                <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-white font-extrabold p-3 rounded-lg text-xs shadow-md transition-all">
                  ✔ File Execution Log
                </button>
              </div>
            </div>
          )}

        </form>

        {/* Right Side Info Panels */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Transaction Summary Ticket */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Trade Audit Ticket</span>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 uppercase">
                {asset || "NO SYMBOL"}
              </span>
            </div>

            <div className="text-center py-4">
              <span className="text-xs font-medium text-zinc-400 block mb-1">Projected Net Outcome</span>
              <h2 className={`text-4xl font-black font-mono tracking-tight ${netPnl >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-500"}`}>
                {netPnl >= 0 ? "+" : ""}${netPnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h2>
              <span className={`text-xs font-semibold inline-flex items-center gap-1 mt-1 font-mono ${roi >= 0 ? "text-emerald-600/80 dark:text-emerald-400/80" : "text-rose-600/80 dark:text-rose-500/80"}`}>
                <BadgePercent size={14} /> {roi >= 0 ? "+" : ""}{roi.toFixed(2)}% ROI
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-4 text-xs">
              <div>
                <span className="text-zinc-400 block">Gross Revenue</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 font-mono">${grossReturn.toFixed(2)}</span>
              </div>
              <div className="text-right">
                <span className="text-zinc-400 block">Trading Fees</span>
                <span className="font-bold text-zinc-600 dark:text-zinc-400 font-mono">${feePaid.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 font-medium">Risk / Reward Profile</span>
                <span className="font-bold font-mono text-zinc-500 dark:text-zinc-400">R:R {rrRatio}</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-950 h-2 rounded-full overflow-hidden flex border border-zinc-200/50 dark:border-transparent">
                <div className="bg-rose-500 h-2" style={{ width: sl > 0 ? "40%" : "0%" }} />
                <div className="bg-emerald-500 h-2 flex-1" style={{ width: tp > 0 ? "60%" : "0%" }} />
              </div>
              <div className="flex justify-between text-[10px] font-mono font-bold">
                <span className="text-rose-600 dark:text-rose-400">Risk: {totalRisk > 0 ? `$${totalRisk.toFixed(2)}` : "--"}</span>
                <span className="text-emerald-600 dark:text-emerald-400">Reward: {totalReward > 0 ? `$${totalReward.toFixed(2)}` : "--"}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Helper Panels (Fixed Gray Text!) */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex items-start gap-3 transition-colors">
            <BrainCircuit className="text-cyan-500 dark:text-cyan-400 shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">Psychological Edge Analysis</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">The journal aggregates pre-trade emotions to discover what mental profiles generate consistency.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex items-start gap-3 transition-colors">
            <ShieldAlert className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">Execution Quality Audit</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">Filing discipline score metrics flags behavioral leakage and rules-slippage streaks automatically.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
