export type Market = 'Crypto' | 'Forex' | 'Stocks' | 'Options';
export type OrderType = 'Long' | 'Short';
export type Sentiment = 'Bullish' | 'Bearish' | 'Choppy' | 'Rangebound';

export type Trade = {
  id: string;
  date: string;
  asset: string;
  market: Market;
  orderType: OrderType;
  entryPrice: number;
  exitPrice: number;
  positionSize: number;
  fees: number;
  takeProfit: number;
  stopLoss: number;
  grossPnl: number;
  netPnl: number;
  rrRatio: number;
  percentageGain: number;
  preTradeEmotion: string;
  postTradeEmotion: string;
  disciplineRating: number;
  notes: string;
  chartUrl?: string;
  marketSentiment: Sentiment;
  newsCatalyst?: string;
  mistakeTags: string[];
};
