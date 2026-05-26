"use client";

import { TradesProvider } from "@/context/TradesContext";

export function TradesProviderWrapper({ children }: { children: React.ReactNode }) {
  return <TradesProvider>{children}</TradesProvider>;
}
