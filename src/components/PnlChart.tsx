"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from './StatCard';

interface PnlChartProps {
  data: { date: string; balance: number; netPnl: number }[];
  className?: string;
}

export function PnlChart({ data, className }: PnlChartProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait until the component is mounted to avoid hydration mismatch with themes
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine active theme colors dynamically
  const currentTheme = mounted ? (theme === 'system' ? resolvedTheme : theme) : 'dark';
  const isDark = currentTheme === 'dark';

  // Dynamic Chart Colors
  const gridColor = isDark ? '#27272a' : '#e4e4e7'; // zinc-800 vs zinc-200
  const axisColor = isDark ? '#71717a' : '#a1a1aa'; // zinc-500 vs zinc-400
  const tooltipBg = isDark ? '#18181b' : '#ffffff'; // zinc-950 vs white
  const tooltipBorder = isDark ? '#27272a' : '#e4e4e7'; // zinc-800 vs zinc-200
  const tooltipText = isDark ? '#f4f4f5' : '#18181b'; // zinc-100 vs zinc-950

  return (
    <div className={cn("bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 transition-colors duration-300", className)}>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 transition-colors">Account Equity Curve</h3>
      <div className="h-[300px] w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="date" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip
                contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, borderRadius: '8px' }}
                itemStyle={{ color: '#34d399', fontWeight: 600 }}
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
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm animate-pulse">Loading Chart...</div>
        )}
      </div>
    </div>
  );
}
