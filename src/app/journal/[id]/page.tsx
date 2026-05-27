"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTrades } from "@/context/TradesContext";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Market, OrderType, Sentiment } from "@/lib/types";

export default function EditTradePage() {
  const router = useRouter();
  const { id } = useParams();
  const { trades, updateTrade, isLoaded } = useTrades();
  
  // State variables for form inputs
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

  // Find and load the existing trade data
  useEffect(() => {
    if (isLoaded && trades.length > 0) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset.trim()) return alert("Asset symbol is required.");

    const numEntry = parseFloat(entryPrice) || 0;
    const numExit = parseFloat(exitPrice) || 0;
    const numSize = parseFloat(positionSize) || 0;
    const numFees = parseFloat(fees) || 0;

    let grossPnl = 0;
    if (numEntry > 0 && numExit > 0 && numSize > 0) {
      grossPnl = orderType === "Long" ? (numExit - numEntry) * numSize : (numEntry - numExit) * numSize;
    }
    const netPnl = grossPnl - numFees;
    const roi = numEntry > 0 && numSize > 0 ? (netPnl / (numEntry * numSize)) * 100 : 0;

    let riskAmount = 0, rewardAmount = 0, rrRatio = 0;
    const numSL = parseFloat(stopLoss) || 0;
    const numTP = parseFloat(takeProfit) || 0;
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
      id: id as string,
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
    <div className="max-w-2xl mx-auto space-y-6 pb-12 transition-colors duration-300 text-zinc-900 dark:text-zinc-100">
      <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <Link href="/journal" className="p-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Modify Transaction Audit</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Correct trade exit parameters, notes, or execution mistakes.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl space-y-4 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Exit Price</label>
            <input type="number" step="any" value={exitPrice} onChange={(e) => setExitPrice(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs font-mono text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500" required />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Fees & Commissions</label>
            <input type="number" step="any" value={fees} onChange={(e) => setFees(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs font-mono text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500" required />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider block mb-1.5">Post-Trade Retrospective Notes</label>
          <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500 resize-none font-sans" placeholder="Update your performance analysis..." />
        </div>

        <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-extrabold p-3 rounded-lg text-xs shadow-md transition-all flex justify-center gap-1.5 hover:opacity-90">
          <CheckCircle size={14} /> Update Log Parameters
        </button>
      </form>
    </div>
  );
}
