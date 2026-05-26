"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Brain, 
  ShieldAlert, 
  Sparkles, 
  Layers, 
  Globe, 
  BrainCircuit, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  CheckCircle,
  BadgePercent
} from "lucide-react";
import { useTrades } from "@/context/TradesContext";
import { Market, OrderType, Sentiment } from "@/lib/types";

const PRESET_EMOTIONS_PRE = [
  "Calm", 
  "Confident", 
  "Fearful of Missing Out (FOMO)", 
  "Anxious", 
  "Impatient", 
  "Excited", 
  "Greedy"
];

const PRESET_EMOTIONS_POST = [
  "Disciplined", 
  "Relieved", 
  "Frustrated", 
  "Satisfied", 
  "Angry", 
  "Greedy"
];

const PRESET_MISTAKES = [
  "#FOMO",
  "#EarlyExit",
  "#ChasedThePump",
  "#NoStopLoss",
  "#Overleveraged",
  "#RevengeTrading",
  "#FightingTheTrend",
  "#AveragingDown"
];

export default function NewTradePage() {
  const router = useRouter();
  const { addTrade, trades } = useTrades();

  // Active step navigation: 0 = Setup, 1 = Context, 2 = Psychology
  const [activeStep, setActiveStep] = useState(0);

  // Form State
  const [market, setMarket] = useState<string>("Crypto");
  const [asset, setAsset] = useState("");
  const [orderType, setOrderType] = useState<"Long" | "Short">("Long");
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

  // Set default current time on load
  useEffect(() => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
    setDate(localISOTime);
  }, []);

  // Calculated Real-Time Metrics
  const numEntry = parseFloat(entryPrice) || 0;
  const numExit = parseFloat(exitPrice) || 0;
  const numSize = parseFloat(positionSize) || 0;
  const numFees = parseFloat(fees) || 0;
  const numSL = parseFloat(stopLoss) || 0;
  const numTP = parseFloat(takeProfit) || 0;

  // Gross PnL Calculation
  let grossPnl = 0;
  if (numEntry > 0 && numExit > 0 && numSize > 0) {
    if (orderType === "Long") {
      grossPnl = (numExit - numEntry) * numSize;
    } else {
      grossPnl = (numEntry - numExit) * numSize;
    }
  }

  // Net PnL Calculation
  const netPnl = grossPnl - numFees;

  // ROI / Gain Percentage Calculation
  const roi = numEntry > 0 && numSize > 0 ? (netPnl / (numEntry * numSize)) * 100 : 0;

  // Risk / Reward Ratio Calculation
  let riskAmount = 0;
  let rewardAmount = 0;
  let rrRatio = 0;

  if (numEntry > 0) {
    if (orderType === "Long") {
      if (numSL > 0 && numSL < numEntry) {
        riskAmount = (numEntry - numSL) * numSize;
      }
      if (numTP > numEntry) {
        rewardAmount = (numTP - numEntry) * numSize;
      }
    } else {
      if (numSL > numEntry) {
        riskAmount = (numSL - numEntry) * numSize;
      }
      if (numTP > 0 && numTP < numEntry) {
        rewardAmount = (numEntry - numTP) * numSize;
      }
    }
    if (riskAmount > 0 && rewardAmount > 0) {
      rrRatio = rewardAmount / riskAmount;
    }
  }

  // Emotion Insight Calculator
  const getEmotionInsight = () => {
    if (!preTradeEmotion) return null;
    const sameEmotionTrades = trades.filter(t => t.preTradeEmotion === preTradeEmotion);
    
    if (sameEmotionTrades.length === 0) {
      if (preTradeEmotion.includes("FOMO") || preTradeEmotion === "Greedy") {
        return {
          type: "warning",
          text: "Logging this trade with FOMO / Greed? Historically, these emotions correlate with heavy losses. Consider reducing position size by 50%."
        };
      }
      if (preTradeEmotion === "Calm" || preTradeEmotion === "Confident") {
        return {
          type: "success",
          text: "Calm and confident mindsets historically achieve your highest execution accuracy. Stick to your trading plan."
        };
      }
      return {
        type: "info",
        text: `Starting a trade in a state of: ${preTradeEmotion}. Ensure you are following strict risk rules.`
      };
    }

    const wins = sameEmotionTrades.filter(t => t.netPnl > 0).length;
    const rate = (wins / sameEmotionTrades.length) * 100;

    if (rate < 30) {
      return {
        type: "warning",
        text: `⚠️ Behavioral Alert: Your win rate when entering trades with '${preTradeEmotion}' is only ${rate.toFixed(0)}% (out of ${sameEmotionTrades.length} trades). Control your size!`
      };
    } else if (rate >= 60) {
      return {
        type: "success",
        text: `✨ Performance Boost: You have a strong ${rate.toFixed(0)}% win rate when trading in a '${preTradeEmotion}' mindset. Execution matches high statistical edge.`
      };
    } else {
      return {
        type: "info",
        text: `💡 Behavioral Stats: You have a ${rate.toFixed(0)}% win rate when entering trades feeling '${preTradeEmotion}' (over ${sameEmotionTrades.length} trades).`
      };
    }
  };

  const insight = getEmotionInsight();

  // Smart Validation System
  const getValidationWarnings = () => {
    const warnings: string[] = [];
    
    if (numEntry > 0) {
      if (orderType === "Long") {
        if (numSL > 0 && numSL >= numEntry) {
          warnings.push("Stop Loss must be below Entry Price for a Long order.");
        }
        if (numTP > 0 && numTP <= numEntry) {
          warnings.push("Take Profit must be above Entry Price for a Long order.");
        }
      } else {
        if (numSL > 0 && numSL <= numEntry) {
          warnings.push("Stop Loss must be above Entry Price for a Short order.");
        }
        if (numTP > 0 && numTP >= numEntry) {
          warnings.push("Take Profit must be below Entry Price for a Short order.");
        }
      }
    }

    if (!numSL) {
      warnings.push("No Stop Loss specified. Trading without a hard stop exposes you to extreme tail risk.");
    }

    if (numSize > 0 && numEntry > 0) {
      const positionValue = numEntry * numSize;
      if (positionValue > 25000 && market === "Crypto") {
        warnings.push(`High exposure warning: Position size of $${positionValue.toLocaleString()} in Crypto may lead to high volatility slippage.`);
      }
    }

    return warnings;
  };

  const validationWarnings = getValidationWarnings();

  const handleToggleMistake = (tag: string) => {
    if (mistakeTags.includes(tag)) {
      setMistakeTags(mistakeTags.filter(t => t !== tag));
    } else {
      setMistakeTags([...mistakeTags, tag]);
    }
  };

  const handleAddCustomMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (customMistake.trim()) {
      const cleanTag = customMistake.trim().startsWith("#") ? customMistake.trim() : `#${customMistake.trim()}`;
      if (!mistakeTags.includes(cleanTag)) {
        setMistakeTags([...mistakeTags, cleanTag]);
      }
      setCustomMistake("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset.trim()) return alert("Asset symbol is required.");
    if (!entryPrice || !exitPrice || !positionSize) return alert("Please fill out Entry, Exit, and Position Size fields.");

    addTrade({
      date: date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      market: market as Market,
      asset: asset.toUpperCase(),
      orderType: orderType as OrderType,
      entryPrice: numEntry,
      exitPrice: numExit,
      positionSize: numSize,
      fees: numFees,
      takeProfit: numTP,
      stopLoss: numSL,
      netPnl: netPnl,
      percentageGain: roi,
      rrRatio: rrRatio,
      preTradeEmotion,
      postTradeEmotion,
      disciplineRating,
      notes,
      chartUrl: chartUrl || undefined,
      marketSentiment: marketSentiment as Sentiment,
      newsCatalyst: newsCatalyst || undefined,
      mistakeTags: mistakeTags
    });

    router.push("/journal");
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

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: THE STEP WIZARD FORM */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
          
          {/* Step Navigation Tabs */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 text-xs font-bold uppercase tracking-wider">
            <button type="button" onClick={() => setActiveStep(0)} className={`flex-1 py-4 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${activeStep === 0 ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-zinc-900/40" : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"}`}>
              <Layers size={14} /> 1. Setup & Order
            </button>
            <button type="button" onClick={() => setActiveStep(1)} className={`flex-1 py-4 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${activeStep === 1 ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-zinc-900/40" : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"}`}>
              <Globe size={14} /> 2. Market Context
            </button>
            <button type="button" onClick={() => setActiveStep(2)} className={`flex-1 py-4 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${activeStep === 2 ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-zinc-900/40" : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"}`}>
              <BrainCircuit size={14} /> 3. Psychology
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* STEP 1: EXECUTION DETAILS */}
            {activeStep === 0 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Market Type</label>
                    <select value={market} onChange={(e) => setMarket(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500">
                      <option value="Crypto">Crypto</option>
                      <option value="Forex">Forex</option>
                      <option value="Stocks">Stocks</option>
                      <option value="Options">Options</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Asset Symbol</label>
                    <input type="text" placeholder="e.g. SOL" value={asset} onChange={(e) => setAsset(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 uppercase focus:outline-none focus:border-emerald-500 placeholder-zinc-400 font-medium" required />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Order Direction</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setOrderType("Long")} className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${orderType === "Long" ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm font-black" : "border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-400"}`}>
                      <TrendingUp size={14} /> LONG (Buy)
                    </button>
                    <button type="button" onClick={() => setOrderType("Short")} className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${orderType === "Short" ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-sm font-black" : "border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-400"}`}>
                      <TrendingDown size={14} /> SHORT (Sell)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Entry Price</label>
                    <input type="number" step="any" placeholder="0.00" value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Exit Price</label>
                    <input type="number" step="any" placeholder="0.00" value={exitPrice} onChange={(e) => setExitPrice(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Position Size</label>
                    <input type="number" step="any" placeholder="Units" value={positionSize} onChange={(e) => setPositionSize(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono" required />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Stop Loss</label>
                    <input type="number" step="any" placeholder="0.00" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Take Profit</label>
                    <input type="number" step="any" placeholder="0.00" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Fees & Comm.</label>
                    <input type="number" step="any" placeholder="0.00" value={fees} onChange={(e) => setFees(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono" />
                  </div>
                </div>

                <button type="button" onClick={() => setActiveStep(1)} className="w-full bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold p-3 rounded-lg text-xs mt-2 transition-all shadow-sm">
                  Next: Market Context →
                </button>
              </div>
            )}

            {/* STEP 2: MARKET CONTEXT */}
            {activeStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Trade Date & Time</label>
                    <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500 font-sans" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Market Sentiment</label>
                    <select value={marketSentiment} onChange={(e) => setMarketSentiment(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500">
                      <option value="Bullish">🐂 Bullish</option>
                      <option value="Bearish">🐻 Bearish</option>
                      <option value="Choppy">🌊 Choppy / Volatile</option>
                      <option value="Rangebound">⚖️ Rangebound / Consolidation</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">News Catalyst</label>
                    <input type="text" placeholder="e.g. CPI Release, FOMC" value={newsCatalyst} onChange={(e) => setNewsCatalyst(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500 placeholder-zinc-400" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Chart URL (Screenshot)</label>
                    <input type="url" placeholder="https://tradingview.com/x/..." value={chartUrl} onChange={(e) => setChartUrl(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500 placeholder-zinc-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button type="button" onClick={() => setActiveStep(0)} className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold p-3 rounded-lg text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all">
                    ← Back to Order
                  </button>
                  <button type="button" onClick={() => setActiveStep(2)} className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold p-3 rounded-lg text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all">
                    Next: Psychology →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PSYCHOLOGY & NOTES */}
            {activeStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Pre-Trade Emotion</label>
                    <select value={preTradeEmotion} onChange={(e) => setPreTradeEmotion(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500">
                      {PRESET_EMOTIONS_PRE.map(emo => (
                        <option key={emo} value={emo}>{emo}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Post-Trade Emotion</label>
                    <select value={postTradeEmotion} onChange={(e) => setPostTradeEmotion(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500">
                      {PRESET_EMOTIONS_POST.map(emo => (
                        <option key={emo} value={emo}>{emo}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-500 tracking-wider mb-2">
                    Discipline Rating: <span className="text-emerald-600 dark:text-emerald-400 font-mono">{disciplineRating} / 5</span>
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setDisciplineRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                          <Star size={22} className={star <= disciplineRating ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.3)]" : "text-zinc-300 dark:text-zinc-700 hover:text-zinc-400"} />
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                      {disciplineRating === 5 && "⭐ Flawless Execution"}
                      {disciplineRating === 4 && "👍 Followed the plan"}
                      {disciplineRating === 3 && "⚠️ Slipped rules"}
                      {disciplineRating === 2 && "❌ Violated parameters"}
                      {disciplineRating === 1 && "🔥 Extreme Revenge trade"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Mistake Tags</label>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {PRESET_MISTAKES.map(tag => {
                      const selected = mistakeTags.includes(tag);
                      return (
                        <button type="button" key={tag} onClick={() => handleToggleMistake(tag)} className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all border ${selected ? "bg-rose-500/10 border-rose-400 text-rose-600 dark:text-rose-400 font-bold" : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"}`}>
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Add custom mistake tag..." value={customMistake} onChange={(e) => setCustomMistake(e.target.value)} className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-rose-500 transition-colors flex-1" />
                    <button type="button" onClick={handleAddCustomMistake} className="bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 px-3 py-2 rounded-lg text-xs font-bold transition-colors">Add</button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Retrospective Notes</label>
                  <textarea rows={4} placeholder="Reflect on execution details, slippage indicators, or psychological triggers..." value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500 placeholder-zinc-400 resize-none font-sans" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button type="button" onClick={() => setActiveStep(1)} className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold p-3 rounded-lg text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all">
                    ← Back to Context
                  </button>
                  <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-white font-extrabold p-3 rounded-lg text-xs shadow-md transition-all flex items-center justify-center gap-1.5">
                    <CheckCircle size={14} /> Save & Log Trade
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* RIGHT COLUMN: REAL-TIME ANALYTICAL METRICS TICKET */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Audit Summary Ticket Box */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[60px] opacity-15 transition-colors duration-500 ${netPnl > 0 ? "bg-emerald-500" : netPnl < 0 ? "bg-rose-500" : "bg-cyan-500"}`} />

            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <span className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={12} className="text-amber-500" /> Live Trade Metrics
              </span>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-transparent uppercase">
                {asset ? asset.toUpperCase() : "NO SYMBOL"}
              </span>
            </div>

            <div className="text-center py-2">
              <span className="text-xs font-medium text-zinc-400 block mb-1">Projected Net Outcome</span>
              <h2 className={`text-4xl font-black font-mono tracking-tight ${netPnl >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-500"}`}>
                {netPnl >= 0 ? "+" : ""}${netPnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h2>
              <span className={`text-xs font-semibold inline-flex items-center gap-1 mt-1.5 font-mono ${roi >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-500"}`}>
                <BadgePercent size={13} /> {roi >= 0 ? "+" : ""}{roi.toFixed(2)}% ROI
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-4 text-xs">
              <div>
                <span className="text-zinc-400 block">Gross Revenue</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 font-mono">${grossPnl.toFixed(2)}</span>
              </div>
              <div className="text-right">
                <span className="text-zinc-400 block">Trading Fees</span>
                <span className="font-bold text-zinc-600 dark:text-zinc-400 font-mono">${numFees.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 font-medium">Risk / Reward Profile</span>
                <span className={`font-bold font-mono px-1.5 py-0.5 rounded text-[11px] ${rrRatio >= 1.5 ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10" : rrRatio > 0 ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10" : "text-zinc-400 bg-zinc-100 dark:bg-zinc-950"}`}>
                  {rrRatio > 0 ? `${rrRatio.toFixed(2)}R Target` : "R:R undefined"}
                </span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-950 h-2 rounded-full overflow-hidden flex border border-zinc-200/50 dark:border-transparent">
                {rrRatio > 0 ? (
                  <>
                    <div className="bg-rose-500 h-full transition-all duration-300" style={{ width: `${(1 / (1 + rrRatio)) * 100}%` }} />
                    <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${(rrRatio / (1 + rrRatio)) * 100}%` }} />
                  </>
                ) : (
                  <div className="bg-zinc-200 dark:bg-zinc-800 w-full h-full" />
                )}
              </div>
              <div className="flex justify-between text-[10px] font-mono font-bold">
                <span className="text-rose-600 dark:text-rose-400">Risk: {riskAmount > 0 ? `$${riskAmount.toFixed(2)}` : "--"}</span>
                <span className="text-emerald-600 dark:text-emerald-400">Reward: {rewardAmount > 0 ? `$${rewardAmount.toFixed(2)}` : "--"}</span>
              </div>
            </div>
          </div>

          {/* DYNAMIC PSYCHOLOGICAL INSIGHT BANNER */}
          {insight && (
            <div className={`p-4 rounded-xl border text-sm transition-colors duration-300 shadow-sm ${insight.type === "warning" ? "bg-rose-50 dark:bg-rose-950/15 border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300" : insight.type === "success" ? "bg-emerald-50 dark:bg-emerald-950/15 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300" : "bg-cyan-50 dark:bg-cyan-950/15 border-cyan-200 dark:border-cyan-500/30 text-cyan-800 dark:text-cyan-300"}`}>
              <div className="flex items-start gap-3">
                <Brain size={18} className={`shrink-0 mt-0.5 ${insight.type === "warning" ? "text-rose-600 dark:text-rose-400" : insight.type === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-cyan-600 dark:text-cyan-400"}`} />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider mb-1">Psychological Edge Analysis</h4>
                  <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">{insight.text}</p>
                </div>
              </div>
            </div>
          )}

          {/* SMART EXECUTION VALIDATION BANNER */}
          {validationWarnings.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/15 border border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-300 rounded-xl p-4 text-xs space-y-2 shadow-sm transition-colors">
              <div className="flex items-center gap-2 border-b border-amber-200 dark:border-amber-500/10 pb-1.5 font-bold uppercase tracking-wider">
                <ShieldAlert size={14} className="text-amber-600 dark:text-amber-400" /> Execution Quality Audit
              </div>
              <ul className="list-disc pl-4 space-y-1 text-zinc-600 dark:text-zinc-300 font-medium">
                {validationWarnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
