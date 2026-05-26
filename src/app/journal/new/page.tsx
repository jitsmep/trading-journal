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
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm space-y-0">
          
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
                    <select value={market} onChange={(e) => setMarket(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:
