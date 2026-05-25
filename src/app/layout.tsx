import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { TradesProvider } from "@/context/TradesContext";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html 
      lang="en" 
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 font-sans transition-colors duration-300">
        <Providers>
          <TradesProvider>
            <Sidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">
              {children}
            </main>
          </TradesProvider>
        </Providers>
      </body>
    </html>
  );
}
