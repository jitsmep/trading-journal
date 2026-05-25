import { Calendar as CalendarIcon, AlertCircle } from "lucide-react";

export default function CalendarPage() {
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Trade Calendar</h1>
        <p className="text-zinc-400 mt-1">Track day-to-day frequency and consistency maps.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
            <CalendarIcon className="text-emerald-400" size={20} /> May 2026
          </h2>
          <span className="text-xs text-zinc-400 flex items-center gap-1 bg-zinc-950 px-3 py-1 rounded-md border border-zinc-800">
            <AlertCircle size={12} className="text-cyan-400" /> Hover over dates to see session notes
          </span>
        </div>

        <div className="grid grid-cols-7 gap-3 text-center font-medium text-sm text-zinc-500 border-b border-zinc-800 pb-2 mb-4">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        
        <div className="grid grid-cols-7 gap-3">
          <div className="bg-transparent h-24"></div>
          <div className="bg-transparent h-24"></div>
          <div className="bg-transparent h-24"></div>
          <div className="bg-transparent h-24"></div>
          <div className="bg-transparent h-24"></div>

          {daysInMonth.map((day) => {
            const isGreenDay = day === 6 || day === 13 || day === 20;
            const isRedDay = day === 8 || day === 15;

            return (
              <div 
                key={day} 
                className={`h-24 p-2 rounded-lg border flex flex-col justify-between items-start transition-all cursor-pointer ${
                  isGreenDay ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-400' :
                  isRedDay ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-400' :
                  'bg-zinc-950 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <span className={`text-xs font-bold ${
                  isGreenDay ? 'text-emerald-400' : isRedDay ? 'text-rose-400' : 'text-zinc-400'
                }`}>{day}</span>
                
                {isGreenDay && <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">+$420.00</span>}
                {isRedDay && <span className="text-xs text-rose-400 font-medium bg-rose-500/10 px-1.5 py-0.5 rounded">-$150.00</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}