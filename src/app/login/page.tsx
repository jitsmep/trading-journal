"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // We will verify this securely on the server via an Environment Variable
    if (password === "admin") { // We will make this variable secure in the next step!
      // Set an unlock authorization timestamp cookie
      document.cookie = "antigravity_session=authenticated; path=/; max-age=86400; SameSite=Strict";
      router.push("/");
      router.refresh();
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 transition-colors">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <ShieldCheck size={26} />
          </div>
          <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">AntiGravity Terminal</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Authentication required to bridge encrypted ledger contextual context.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-3.5 text-zinc-400 dark:text-zinc-500" />
            <input 
              type="password" 
              placeholder="Enter Master Passkey..."
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 pl-10 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              required
            />
          </div>

          {error && (
            <p className="text-[11px] font-bold text-rose-500 text-center animate-pulse">❌ Access Denied: Invalid Terminal Signatures.</p>
          )}

          <button type="submit" className="w-full bg-zinc-900 dark:bg-zinc-100 hover:opacity-90 text-white dark:text-zinc-950 font-bold p-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md">
            Authorize Node Access <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
