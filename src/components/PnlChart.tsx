"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from './StatCard';

interface PnlChartProps {
  data: { date: string; balance: number; netPnl: number }[];
  className?: string;
}

export function PnlChart({ data, className }: PnlChartProps) {
  return (
    <div className={cn("bg-zinc-900 border border-zinc-800 rounded-xl p-5", className)}>
      <h3 className="text-lg font-semibold text-zinc-100 mb-4">Account Equity Curve</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
              itemStyle={{ color: '#34d399' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Balance']}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#34d399"
              strokeWidth={3}
              dot={{ fill: '#34d399', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
