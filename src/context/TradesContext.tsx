"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTrades } from "@/context/TradesContext";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function EditTradePage() {
  const router = useRouter();
  const { id } = useParams();
  const { trades, updateTrade } = useTrades();
  
  // Find the trade we are editing
  const existingTrade = trades.find(t => t.id === id);

  // Initialize state with existing trade data
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (existingTrade) {
      setFormData(existingTrade);
    }
  }, [existingTrade]);

  if (!existingTrade || !formData) return <div className="p-10 text-center">Loading trade...</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTrade(formData); // Save changes
    router.push("/journal");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/journal" className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Edit Trade: {formData.asset}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Net PnL ($)</label>
          <input 
            type="number" 
            value={formData.netPnl} 
            onChange={(e) => setFormData({...formData, netPnl: parseFloat(e.target.value)})}
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-zinc-100"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Notes</label>
          <textarea 
            rows={4}
            value={formData.notes || ""} 
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-zinc-100"
          />
        </div>

        <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-3 rounded-lg flex items-center justify-center gap-2">
          <CheckCircle size={18} /> Save Changes
        </button>
      </form>
    </div>
  );
}
