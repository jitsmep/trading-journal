"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Settings, Shield, Trash2, CheckCircle, RefreshCw, Sun, Moon, Monitor } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isCleared, setIsCleared] = useState(false);

  // Avoid hydration mismatch bugs by waiting for the browser mounting phase
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClearData = () => {
    const confirmWipe = window.confirm(
      "CRITICAL ACTION: Are you sure you want to permanently erase all logged trades from this browser's memory? This cannot be undone."
    );
    
    if (confirmWipe) {
      localStorage.removeItem("trading_journal_trades");
      localStorage.removeItem("journal_starting_balance");
      setIsCleared(true);
      
      setTimeout(() => {
        setIsCleared(false);
        router.push("/");
        router.refresh();
      }, 1500);
    }
  };

  const handleLogout = () => {
    document.cookie = "antigravity_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 text-zinc-900 dark:text-zinc-100 p-1 sm:p-0">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
          <Settings className="text-emerald-500" size={28} /> Control Settings
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm mt-1">
          Manage system storage matrix options, security parameters, and terminal styling.
        </p>
      </div>

      {/* 1. VISUAL THEME OPTIMIZATION CARD */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800 pb-2">
          <Sun size={16} className="text-amber-500" /> Terminal Workspace Theme
        </div>
        <div className="space-y-3">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Select your preferred layout illumination preset profile.
          </p>
          
          {mounted ? (
            <div className="grid grid-cols-3 gap-2.5 max-w-md">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                  theme === "light"
                    ? "border-emerald-500 bg-emerald-500/5 text-emerald-600 font-black"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                }`}
              >
                <Sun size={14} className={theme === "light" ? "text-emerald-500" : ""} /> Light Mode
              </button>

              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                  theme === "dark"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-black"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                }`}
              >
                <Moon size={14} className={theme === "dark" ? "text-emerald-400" : ""} /> Dark Mode
              </button>

              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                  theme === "system"
                    ? "border-emerald-500 bg-emerald-500/5 text-emerald-500 font-black"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                }`}
              >
                <Monitor size={14} className={theme === "system" ? "text-emerald-500" : ""} /> Sync OS
              </button>
            </div>
          ) : (
            <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse max-w-md" />
          )}
        </div>
      </div>

      {/* 2. SECURITY SECTION */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800 pb-2">
          <Shield size={16} className="text-cyan-500" /> Security Layer
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
          <div>
            <p className="font-bold">Gateway Access Status</p>
            <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">Your terminal is currently protected behind a master gatekeeper check rule.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold rounded-lg transition-colors text-xs w-full sm:w-auto"
          >
            Lock Terminal (Logout)
          </button>
        </div>
      </div>

      {/* 3. STORAGE SECTION */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800 pb-2">
          <Trash2 size={16} className="text-rose-500" /> Local Data Storage Management
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
          <div>
            <p className="font-bold text-rose-500">Wipe Transaction History</p>
            <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">Permanently clear all cached trade metrics, emotional data, and metrics from this browser.</p>
          </div>
          <button 
            onClick={handleClearData}
            disabled={isCleared}
            className={`px-4 py-2 text-white font-bold rounded-lg transition-all text-xs w-full sm:w-auto flex items-center justify-center gap-1.5 ${
              isCleared ? "bg-emerald-500" : "bg-rose-500 hover:bg-rose-600 shadow-md"
            }`}
          >
            {isCleared ? (
              <>
                <CheckCircle size={14} /> Wiped Successfully!
              </>
            ) : (
              <>
                <RefreshCw size={14} /> Erase Database Memory
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
