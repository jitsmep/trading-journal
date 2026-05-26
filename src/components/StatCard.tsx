import React, { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon?: ReactNode;
  className?: string;
}

export function StatCard({ title, value, trend, trendUp, icon, className = "" }: StatCardProps) {
  return (
    <div className={cn("p-5 rounded-xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 transition-colors duration-300", className)}>
      <div className="flex justify-between items-start">
        <div>
          {/* Title text */}
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">{title}</p>
          {/* Main Value text */}
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 break-all">{value}</h3>
        </div>
        {/* Icon box */}
        {icon && (
          <div className="p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg text-zinc-500 dark:text-zinc-400">
            {icon}
          </div>
        )}
      </div>
      
      {/* Trend text */}
      {trend && (
        <div className="mt-4 flex items-center gap-1.5 text-xs font-medium">
          <span className={trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
            {trendUp !== undefined && (trendUp ? '↑ ' : '↓ ')}{trend}
          </span>
        </div>
      )}
    </div>
  );
}
