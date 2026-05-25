import { StatCard } from "@/components/StatCard";
import { PnlChart } from "@/components/PnlChart";
import { mockTrades, generatePnlData } from "../../lib/mockData";
import { DollarSign, Percent, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const pnlData = generatePnlData();
  const totalPnl = mockTrades.reduce((acc, trade) => acc + trade.netPnl, 0);
  const winRate = ((mockTrades.filter(t => t.netPnl > 0).length / mockTrades.length) * 100).toFixed(1);
  const totalTrades = mockTrades.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Dashboard</h1>
          <p className="text-zinc-400 mt-1">Overview of your trading performance.</p>
        </div>
        <Link href="/journal/new" className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-5 py-2.5 rounded-lg transition-colors">
          + Log New Trade
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Net PnL"
          value={`$${totalPnl.toFixed(2)}`}
          trend="Last 7 days"
          trendUp={totalPnl > 0}
          icon={<DollarSign size={20} />}
        />
        <StatCard
          title="Win Rate"
          value={`${winRate}%`}
          trend="vs 45% last month"
          trendUp={Number(winRate) > 45}
          icon={<Percent size={20} />}
        />
        <StatCard
          title="Total Trades"
          value={totalTrades.toString()}
          icon={<TrendingUp size={20} />}
        />
        <StatCard
          title="Avg Risk/Reward"
          value="1.37R"
          trend="Needs improvement"
          trendUp={false}
          icon={<AlertTriangle size={20} />}
        />
      </div>

      <PnlChart data={pnlData} />

      <div>
        <h2 className="text-xl font-bold text-zinc-100 mb-4">Recent Trades</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-800/50 text-zinc-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Asset</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Net PnL</th>
                <th className="px-6 py-4 font-medium">Emotion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {mockTrades.slice().reverse().map((trade) => (
                <tr key={trade.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">{new Date(trade.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-zinc-200">{trade.asset}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${trade.orderType === 'Long' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {trade.orderType}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-medium ${trade.netPnl >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                    ${trade.netPnl.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">{trade.postTradeEmotion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
