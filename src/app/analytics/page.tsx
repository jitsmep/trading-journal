import { StatCard } from "@/components/StatCard";
// Fixed: Changed from absolute path alias to relative file system path
import { mockTrades } from "../../../lib/mockData";
import { Target, BrainCircuit, CalendarDays, Frown } from 'lucide-react';

export default function AnalyticsPage() {
  const allMistakes = mockTrades.flatMap(t => t.mistakeTags || []);
  const mistakeCounts = allMistakes.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedMistakes = Object.entries(mistakeCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Analytics & Insights</h1>
        <p className="text-zinc-400 mt-1">Deep dive into your performance patterns and psychology.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Most Frequent Mistake"
          value={sortedMistakes.length > 0 ? sortedMistakes[0][0] : "None"}
          icon={<Frown size={20} />}
          className="border-rose-500/30"
        />
        <StatCard
          title="Best Performing Asset"
          value="TSLA"
          trend="8.33% Avg Return"
          trendUp={true}
          icon={<Target size={20} />}
          className="border-emerald-500/30"
        />
        <StatCard
          title="Avg Discipline Rating"
          value="4.0 / 5"
          trend="Consistent"
          trendUp={true}
          icon={<BrainCircuit size={20} />}
          className="border-cyan-500/30"
        />
        <StatCard
          title="Most Profitable Day"
          value="Wednesday"
          icon={<CalendarDays size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mistake Tracker */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">Mistake Tracker</h2>
          {sortedMistakes.length > 0 ? (
            <div className="space-y-3">
              {sortedMistakes.map(([tag, count]) => (
                <div key={tag} className="flex justify-between items-center p-3 bg-zinc-950 rounded-lg border border-zinc-800/50">
                  <span className="text-rose-400 font-medium">{tag}</span>
                  <span className="text-zinc-400 bg-zinc-800 px-2.5 py-0.5 rounded text-sm">{count} occurrences</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 italic">No mistakes logged yet. Good job!</p>
          )}
        </div>

        {/* Emotion Correlation */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">Emotion vs Win Rate</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-zinc-300">Calm & Collected</span>
                <span className="text-emerald-400 font-medium">85% Win Rate</span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-2.5 border border-zinc-800">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-zinc-300">Confident</span>
                <span className="text-emerald-400 font-medium">70% Win Rate</span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-2.5 border border-zinc-800">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-zinc-300">Fear of Missing Out (FOMO)</span>
                <span className="text-rose-500 font-medium">15% Win Rate</span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-2.5 border border-zinc-800">
                <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}