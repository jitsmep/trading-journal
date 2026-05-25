"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  DollarSign, 
  Brain, 
  ShieldAlert, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Plus, 
  X, 
  CheckCircle,
  HelpCircle,
  AlertTriangle
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
  let percentageGain = 0;
  if (numEntry > 0 && numExit > 0) {
    if (orderType === "Long") {
      percentageGain = ((numExit - numEntry) / numEntry) * 100;
    } else {
      percentageGain = ((numEntry - numExit) / numEntry) * 100;
    }
  }

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

  // Emotion Insight Calculator based on existing logs
  const getEmotionInsight = () => {
    if (!preTradeEmotion) return null;

    // Filter trades in local memory that had the same emotion
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

  // Tag helper
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

  // Form Submit Action
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset.trim()) return alert("Asset symbol is required.");
    if (!entryPrice || !exitPrice || !positionSize) return alert("Please fill out Entry, Exit, and Position Size fields.");

    addTrade({
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      asset: asset.toUpperCase(),
      market: market as Market,
      orderType: orderType as OrderType,
      entryPrice: numEntry,
      exitPrice: numExit,
      positionSize: numSize,
      fees: numFees,
      takeProfit: numTP,
      stopLoss: numSL,
      grossPnl: grossPnl,
      netPnl: netPnl,
      rrRatio: rrRatio || 1.0,
      percentageGain: percentageGain,
      preTradeEmotion: preTradeEmotion,
      postTradeEmotion: postTradeEmotion,
      disciplineRating: disciplineRating,
      notes: notes,
      chartUrl: chartUrl || undefined,
      marketSentiment: marketSentiment as Sentiment,
      newsCatalyst: newsCatalyst || undefined,
      mistakeTags: mistakeTags
    });

    router.push("/journal");
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-800 pb-5">
        <div className="space-y-1">
          <Link href="/journal" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors mb-2">
            <ArrowLeft size={16} /> Back to Journal
          </Link>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight">
            Log New Trade
          </h1>
          <p className="text-zinc-400 text-sm">Record execution metrics, notes, emotions, and advanced context tags.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: THE FORM */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Step Navigation Tabs */}
          <div className="flex border-b border-zinc-800 bg-zinc-950/40">
            <button 
              onClick={() => setActiveStep(0)}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeStep === 0 
                  ? "border-emerald-400 text-emerald-400 bg-emerald-500/5" 
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/20"
              }`}
            >
              <Layers size={16} />
              1. Setup & Order
            </button>
            <button 
              onClick={() => setActiveStep(1)}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeStep === 1 
                  ? "border-emerald-400 text-emerald-400 bg-emerald-500/5" 
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/20"
              }`}
            >
              <Plus size={16} />
              2. Market Context
            </button>
            <button 
              onClick={() => setActiveStep(2)}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeStep === 2 
                  ? "border-emerald-400 text-emerald-400 bg-emerald-500/5" 
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/20"
              }`}
            >
              <Brain size={16} />
              3. Psychology
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* STEP 1: EXECUTION DETAILS */}
            {activeStep === 0 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Market</label>
                    <select 
                      value={market} 
                      onChange={(e) => setMarket(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="Crypto">Crypto</option>
                      <option value="Forex">Forex</option>
                      <option value="Stocks">Stocks</option>
                      <option value="Options">Options</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Asset Symbol</label>
                    <input 
                      type="text" 
                      placeholder="e.g. BTC/USD or TSLA"
                      value={asset}
                      onChange={(e) => setAsset(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors uppercase font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Order Direction</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={() => setOrderType("Long")}
                      className={`py-3 rounded-lg font-bold border transition-all text-sm flex items-center justify-center gap-2 ${
                        orderType === "Long" 
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                          : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <TrendingUp size={16} /> LONG (Buy)
                    </button>
                    <button 
                      type="button"
                      onClick={() => setOrderType("Short")}
                      className={`py-3 rounded-lg font-bold border transition-all text-sm flex items-center justify-center gap-2 ${
                        orderType === "Short" 
                          ? "bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]" 
                          : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <TrendingDown size={16} /> SHORT (Sell)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Entry Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-zinc-500 text-sm">$</span>
                      <input 
                        type="number" 
                        step="any"
                        placeholder="0.00"
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(e.target.value)}
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 pl-7 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Exit Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-zinc-500 text-sm">$</span>
                      <input 
                        type="number" 
                        step="any"
                        placeholder="0.00"
                        value={exitPrice}
                        onChange={(e) => setExitPrice(e.target.value)}
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 pl-7 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Position Size (Units)</label>
                    <input 
                      type="number" 
                      step="any"
                      placeholder="e.g. 100 or 0.5"
                      value={positionSize}
                      onChange={(e) => setPositionSize(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-zinc-800/60 pt-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Stop Loss</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-zinc-500 text-sm">$</span>
                      <input 
                        type="number" 
                        step="any"
                        placeholder="0.00"
                        value={stopLoss}
                        onChange={(e) => setStopLoss(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 pl-7 text-zinc-100 placeholder-zinc-750 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Take Profit</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-zinc-500 text-sm">$</span>
                      <input 
                        type="number" 
                        step="any"
                        placeholder="0.00"
                        value={takeProfit}
                        onChange={(e) => setTakeProfit(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 pl-7 text-zinc-100 placeholder-zinc-750 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Fees & Comm.</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-zinc-500 text-sm">$</span>
                      <input 
                        type="number" 
                        step="any"
                        placeholder="0.00"
                        value={fees}
                        onChange={(e) => setFees(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 pl-7 text-zinc-100 placeholder-zinc-750 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg text-sm flex items-center gap-1.5"
                  >
                    Next: Market Context →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: MARKET CONTEXT */}
            {activeStep === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Trade Date & Time</label>
                    <input 
                      type="datetime-local" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Market Sentiment</label>
                    <select 
                      value={marketSentiment} 
                      onChange={(e) => setMarketSentiment(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="Bullish">🐂 Bullish</option>
                      <option value="Bearish">🐻 Bearish</option>
                      <option value="Choppy">🌊 Choppy / Volatile</option>
                      <option value="Rangebound">⚖️ Rangebound / Consolidation</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">News Catalyst / Event</label>
                    <input 
                      type="text" 
                      placeholder="e.g. CPI Print, Earnings Release, FOMC"
                      value={newsCatalyst}
                      onChange={(e) => setNewsCatalyst(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Chart URL (TradingView Screenshot)</label>
                    <input 
                      type="url" 
                      placeholder="e.g. https://tradingview.com/x/..."
                      value={chartUrl}
                      onChange={(e) => setChartUrl(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors font-sans"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-zinc-800/60">
                  <button
                    type="button"
                    onClick={() => setActiveStep(0)}
                    className="border border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-zinc-300 px-5 py-2.5 rounded-lg font-bold transition-all text-sm"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg text-sm flex items-center gap-1.5"
                  >
                    Next: Psychology →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PSYCHOLOGY & POST-MORTEM */}
            {activeStep === 2 && (
              <div className="space-y-5 animate-fadeIn">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Pre-Trade Emotion</label>
                    <select 
                      value={preTradeEmotion} 
                      onChange={(e) => setPreTradeEmotion(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      {PRESET_EMOTIONS_PRE.map(emo => (
                        <option key={emo} value={emo}>{emo}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Post-Trade Emotion</label>
                    <select 
                      value={postTradeEmotion} 
                      onChange={(e) => setPostTradeEmotion(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      {PRESET_EMOTIONS_POST.map(emo => (
                        <option key={emo} value={emo}>{emo}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Discipline Rating: {disciplineRating} / 5
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setDisciplineRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star 
                            size={24} 
                            className={
                              star <= disciplineRating 
                                ? "fill-amber-400 text-amber-400 filter drop-shadow-[0_0_5px_rgba(251,191,36,0.4)]" 
                                : "text-zinc-700 hover:text-zinc-500"
                            } 
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-zinc-400">
                      {disciplineRating === 5 && "⭐ Flawless Execution"}
                      {disciplineRating === 4 && "👍 Followed the plan"}
                      {disciplineRating === 3 && "⚠️ Slipped on entry/exit"}
                      {disciplineRating === 2 && "❌ Violated rules"}
                      {disciplineRating === 1 && "🔥 Extreme mistake / Revenge trade"}
                    </span>
                  </div>
                </div>

                {/* Mistake Tags */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Mistake Tags (Select all that apply)</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {PRESET_MISTAKES.map(tag => {
                      const selected = mistakeTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleMistake(tag)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                            selected 
                              ? "bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.1)]" 
                              : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Custom tag input */}
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add custom mistake tag..."
                      value={customMistake}
                      onChange={(e) => setCustomMistake(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-rose-500 transition-colors flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomMistake}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                    >
                      Add Tag
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Post-Trade Notes & Retrospective</label>
                  <textarea 
                    rows={4}
                    placeholder="Reflect on your trade execution. Did you take profits early? Did you follow your risk parameters? What market factors influenced this decision?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                  />
                </div>

                <div className="flex justify-between pt-4 border-t border-zinc-800/60">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="border border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-zinc-300 px-5 py-2.5 rounded-lg font-bold transition-all text-sm"
                  >
                    ← Back
                  </button>
                  
                  <button
                    type="submit"
                    className="bg-emerald-400 hover:bg-emerald-500 text-zinc-950 px-8 py-3 rounded-lg font-black transition-all shadow-lg text-sm flex items-center gap-1.5 filter drop-shadow-[0_0_15px_rgba(52,211,153,0.2)] hover:scale-[1.02]"
                  >
                    <CheckCircle size={18} /> Save & Log Trade
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* RIGHT COLUMN: REAL-TIME DYNAMIC METRICS PREVIEW */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
            
            {/* Absolute blur glow depending on PnL */}
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[60px] opacity-20 transition-colors duration-500 ${
              netPnl > 0 ? "bg-emerald-400" : netPnl < 0 ? "bg-rose-500" : "bg-cyan-500"
            }`} />

            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <span className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={12} className="text-amber-400" />
                Live Trade Metrics
              </span>
              <span className="text-xs text-zinc-400 bg-zinc-950 px-2 py-0.5 border border-zinc-800 rounded font-mono">
                {asset ? asset.toUpperCase() : "NO SYMBOL"}
              </span>
            </div>

            {/* Main PnL Counter */}
            <div className="text-center py-4 bg-zinc-950/60 border border-zinc-800/80 rounded-xl relative">
              <span className="text-xs font-semibold text-zinc-500 block mb-1 uppercase tracking-wider">Estimated Net Profit/Loss</span>
              <div className={`text-4xl font-extrabold font-mono transition-colors tracking-tight ${
                netPnl > 0 ? "text-emerald-400" : netPnl < 0 ? "text-rose-500" : "text-zinc-400"
              }`}>
                {netPnl > 0 ? "+" : ""}${netPnl.toFixed(2)}
              </div>
              <div className="flex justify-center mt-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  percentageGain > 0 
                    ? "bg-emerald-500/10 text-emerald-400" 
                    : percentageGain < 0 
                    ? "bg-rose-500/10 text-rose-500" 
                    : "bg-zinc-800 text-zinc-500"
                }`}>
                  {percentageGain > 0 ? <TrendingUp size={12} /> : percentageGain < 0 ? <TrendingDown size={12} /> : null}
                  {percentageGain > 0 ? "+" : ""}{percentageGain.toFixed(2)}% ROI
                </span>
              </div>
            </div>

            {/* Technical Parameters (Gross PnL, Fees, R:R) */}
            <div className="grid grid-cols-2 gap-4 text-sm font-medium">
              <div className="bg-zinc-950/40 p-3 border border-zinc-850 rounded-lg">
                <span className="text-xs text-zinc-500 block mb-1">Gross Return</span>
                <span className="text-zinc-200 font-mono font-bold">${grossPnl.toFixed(2)}</span>
              </div>
              <div className="bg-zinc-950/40 p-3 border border-zinc-850 rounded-lg">
                <span className="text-xs text-zinc-500 block mb-1">Trading Fees</span>
                <span className="text-zinc-400 font-mono font-semibold">${numFees.toFixed(2)}</span>
              </div>
            </div>

            {/* Risk to Reward Visualizer */}
            <div className="bg-zinc-950/40 border border-zinc-850 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-zinc-400 uppercase tracking-wider">Risk / Reward Profile</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  rrRatio >= 2.0 
                    ? "bg-emerald-500/10 text-emerald-400" 
                    : rrRatio > 0 
                    ? "bg-amber-500/10 text-amber-400" 
                    : "bg-zinc-800 text-zinc-500"
                }`}>
                  {rrRatio > 0 ? `${rrRatio.toFixed(2)}R Target` : "R:R undefined"}
                </span>
              </div>

              {/* R:R Slider Progress bar */}
              <div className="w-full bg-zinc-900 rounded-full h-3 overflow-hidden flex border border-zinc-850">
                {rrRatio > 0 ? (
                  <>
                    {/* Risk portion (always 1 relative unit) */}
                    <div 
                      className="bg-rose-500 h-full transition-all duration-300" 
                      style={{ width: `${(1 / (1 + rrRatio)) * 100}%` }}
                    />
                    {/* Reward portion (R times risk) */}
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-300" 
                      style={{ width: `${(rrRatio / (1 + rrRatio)) * 100}%` }}
                    />
                  </>
                ) : (
                  <div className="bg-zinc-800 w-full h-full" />
                )}
              </div>

              {/* Legible numbers */}
              <div className="flex justify-between text-xs font-semibold font-mono">
                <span className="text-rose-400">Risk: {riskAmount > 0 ? `$${riskAmount.toFixed(2)}` : "--"}</span>
                <span className="text-emerald-400">Reward: {rewardAmount > 0 ? `$${rewardAmount.toFixed(2)}` : "--"}</span>
              </div>
            </div>
          </div>

          {/* DYNAMIC BEHAVIORAL INSIGHT PANEL */}
          {insight && (
            <div className={`p-4 rounded-xl border text-sm transition-all duration-300 ${
              insight.type === "warning" 
                ? "bg-rose-950/15 border-rose-500/30 text-rose-300" 
                : insight.type === "success" 
                ? "bg-emerald-950/15 border-emerald-500/30 text-emerald-300" 
                : "bg-cyan-950/15 border-cyan-500/30 text-cyan-300"
            }`}>
              <div className="flex items-start gap-3">
                <Brain size={18} className={`shrink-0 mt-0.5 ${
                  insight.type === "warning" 
                    ? "text-rose-400" 
                    : insight.type === "success" 
                    ? "text-emerald-400" 
                    : "text-cyan-400"
                }`} />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider mb-1">Psychological Edge Analysis</h4>
                  <p className="text-xs leading-relaxed text-zinc-300">{insight.text}</p>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE VALIDATION WARNINGS */}
          {validationWarnings.length > 0 && (
            <div className="bg-amber-950/15 border border-amber-500/30 text-amber-300 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 border-b border-amber-500/10 pb-1.5 font-bold uppercase tracking-wider">
                <ShieldAlert size={14} className="text-amber-400" />
                Execution Quality Audit
              </div>
              <ul className="list-disc pl-4 space-y-1 text-zinc-300">
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