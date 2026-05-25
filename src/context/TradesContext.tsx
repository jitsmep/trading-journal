"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trade } from '@/lib/types';
import { mockTrades as initialMockTrades } from '@/lib/mockData';

interface TradesContextType {
  trades: Trade[];
  isLoaded: boolean;
  addTrade: (trade: Omit<Trade, 'id'>) => void;
  deleteTrade: (id: string) => void;
  updateTrade: (trade: Trade) => void;
}

const TradesContext = createContext<TradesContextType | undefined>(undefined);

export function TradesProvider({ children }: { children: React.ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('trading_journal_trades');
    if (stored) {
      try {
        setTrades(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading trades from localStorage, falling back to mock data:', e);
        setTrades(initialMockTrades);
      }
    } else {
      setTrades(initialMockTrades);
      localStorage.setItem('trading_journal_trades', JSON.stringify(initialMockTrades));
    }
    setIsLoaded(true);
  }, []);

  const addTrade = (newTradeData: Omit<Trade, 'id'>) => {
    const newTrade: Trade = {
      ...newTradeData,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
    };
    const updated = [newTrade, ...trades];
    setTrades(updated);
    localStorage.setItem('trading_journal_trades', JSON.stringify(updated));
  };

  const deleteTrade = (id: string) => {
    const updated = trades.filter((t) => t.id !== id);
    setTrades(updated);
    localStorage.setItem('trading_journal_trades', JSON.stringify(updated));
  };

  const updateTrade = (updatedTrade: Trade) => {
    const updated = trades.map((t) => (t.id === updatedTrade.id ? updatedTrade : t));
    setTrades(updated);
    localStorage.setItem('trading_journal_trades', JSON.stringify(updated));
  };

  return (
    <TradesContext.Provider value={{ trades, isLoaded, addTrade, deleteTrade, updateTrade }}>
      {children}
    </TradesContext.Provider>
  );
}

export function useTrades() {
  const context = useContext(TradesContext);
  if (context === undefined) {
    throw new Error('useTrades must be used within a TradesProvider');
  }
  return context;
}
