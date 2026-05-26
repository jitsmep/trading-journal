import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ title, value, trend, trendUp, icon, className = "" }: StatCardProps) {
  return (
    <div className={`p-5 rounded-xl border transition-colors duration-300 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          {/* Title text */}
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">{title}</p>
          {/* Main Value text (Fixed visibility!) */}
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 break-all">{value}</h3>
        </div>
        {/* Icon box */}
        {icon && (
          <div className="p-2 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg">
            {icon}
          </div>
        )}
      </div>
      {/* Trend text */}
      {trend && (
        <div className="mt-4 flex items-center gap-1.5 text-xs font-medium">
          <span className={trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}
