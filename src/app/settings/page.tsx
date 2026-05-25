'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevents server-side rendering mismatch sync errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 min-h-screen transition-colors duration-300 bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuration Settings</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage system configurations and visual dashboard styles.</p>
      </div>

      <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold">Appearance Theme</h2>
          <p className="text-sm text-zinc-400">Select how your cyberpunk trade layout displays across devices.</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Light Mode Option */}
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-lg border text-center font-medium transition-all ${
              theme === 'light'
                ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500 font-semibold'
                : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            ☀️ Light Mode
          </button>

          {/* Dark Mode Option */}
          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-lg border text-center font-medium transition-all ${
              theme === 'dark'
                ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400 font-semibold'
                : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            🌙 Dark Mode
          </button>

          {/* System Sync Option */}
          <button
            onClick={() => setTheme('system')}
            className={`p-4 rounded-lg border text-center font-medium transition-all ${
              theme === 'system'
                ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500 font-semibold'
                : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            💻 System Auto
          </button>
        </div>
      </div>
    </div>
  );
}
