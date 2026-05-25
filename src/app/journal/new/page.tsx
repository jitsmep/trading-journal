import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewTradePage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      <Link href="/journal" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
        <ArrowLeft size={16} /> Back to Journal
      </Link>
      
      <div>
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Log New Trade</h1>
        <p className="text-zinc-400 mt-1">Record metrics, emotional data, and market context.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-zinc-400 text-center py-12">
        <p className="italic">Trade logging form module goes here. Ready to hook up to fields.</p>
      </div>
    </div>
  );
}