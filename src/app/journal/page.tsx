import { mockTrades } from "../../../lib/mockData";
import Link from "next/link";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";

export default function JournalPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Trading Journal</h1>
          <p className="text-zinc-400 mt-1">Review and manage your historical trade logs.</p>
        </div>
        <Link 
          href="/journal/new" 
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} /> New Trade
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/50 text-zinc-400 text-sm font-medium">
                <th className="p-4">Date</th>
                <th className="p-4">Asset</th>
                <th className="p-4">Type</th>
                <th className="p-4">Net PnL</th>
                <th className="p-4">Pre-Emotion</th>
                <th className="p-4">Discipline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
              {mockTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="p-4 text-sm">{new Date(trade.date).toLocaleDateString()}</td>
                  <td className="p-4 font-semibold text-zinc-100">{trade.asset}</td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      trade.orderType === 'Long' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {trade.orderType}
                    </span>
                  </td>
                  <td className={`p-4 font-medium flex items-center gap-1 ${
                    trade.netPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {trade.netPnl >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    ${Math.abs(trade.netPnl).toFixed(2)}
                  </td>
                  <td className="p-4 text-sm text-zinc-400">{trade.preTradeEmotion || "Calm"}</td>
                  <td className="p-4 text-sm text-amber-400">★ {trade.disciplineRating || 4}/5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}