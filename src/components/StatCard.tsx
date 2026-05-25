import { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon?: ReactNode;
  className?: string;
}

export function StatCard({ title, value, trend, trendUp, icon, className }: StatCardProps) {
  return (
    <div className={cn("bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-2", className)}>
      <div className="flex justify-between items-start text-zinc-400">
        <span className="text-sm font-medium">{title}</span>
        {icon && <span className="text-zinc-500">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-zinc-100">{value}</div>
      {trend && (
        <div className={cn("text-xs font-medium flex items-center gap-1", trendUp ? "text-emerald-400" : "text-rose-500")}>
          {trendUp ? '↑' : '↓'} {trend}
        </div>
      )}
    </div>
  );
}
