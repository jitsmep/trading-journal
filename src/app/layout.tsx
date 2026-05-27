import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import dynamic from "next/dynamic";

// THE MAGIC FIX: This forces Next.js to ONLY load your trade data in a real browser.
// It completely prevents the [Client Component SSR] server crash.
const TradesProvider = dynamic(
  () => import("@/context/TradesContext").then((mod) => mod.TradesProvider),
  { ssr: false }
);

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AntiGravity | Trading Journal",
  description: "Defy the gravity of market losses with advanced trading analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TradesProvider>
            <div className="flex">
              <Sidebar />
              <main className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">
                {children}
              </main>
            </div>
          </TradesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
