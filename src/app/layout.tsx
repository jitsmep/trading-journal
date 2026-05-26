import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TradesProviderWrapper } from "@/components/TradesProviderWrapper"; // We will create this

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TradesProviderWrapper>
            {children}
          </TradesProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
