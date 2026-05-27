import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { TradesProvider } from "@/context/TradesContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AntiGravity | Trading Journal",
  description: "Defy the gravity of market losses with advanced trading analytics.",
  manifest: "/manifest.json", 
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
            <div className="relative flex flex-col md:flex-row min-h-screen">
              <Sidebar />
              <main className="flex-1 w-full p-4 md:p-8 overflow-x-hidden overflow-y-auto">
                {children}
              </main>
            </div>
          </TradesProvider>
        </ThemeProvider>

        {/* This triggers the background worker to cache everything for offline use */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
