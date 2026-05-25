You are an expert senior full-stack developer and UI/UX designer. Your task is to build a highly advanced, sleek, and intuitive Trading Journal web application named **"AntiGravity"**. 

The core philosophy of AntiGravity is to help traders "defy the gravity of market losses" by tracking not just data, but the psychological and external factors that drive trading performance.

### 1. Tech Stack Preferences
*   **Frontend:** React.js or Next.js (App Router), Tailwind CSS for styling, Shadcn/ui or Lucide React for icons and UI components.
*   **Charts:** Recharts, Chart.js, or lightweight-charts (TradingView) for financial visualization.
*   **Backend/Database:** Supabase or Firebase (for authentication, real-time database, and storage).

### 2. Core Features & Data Schema to Implement

#### A. Trade Logging Dashboard (The Core)
Every trade log must capture the following data points:
*   **Date & Time:** Entry and exit timestamps (with timezone support).
*   **Asset Details:** Ticker/Symbol, Market (Crypto, Forex, Stocks, Options), Order Type (Long/Short, Market/Limit).
*   **Financial Metrics:** Entry Price, Exit Price, Position Size, Fees/Commission, Take Profit (TP), Stop Loss (SL).
*   **Calculated Fields (Automated):** Gross PnL, Net PnL, R:R Ratio (Risk-to-Reward), Percentage Gain/Loss.

#### B. Emotional & Psychological Tracker (The "AntiGravity" Edge)
Traders often fail due to emotions. We need a dedicated section for psychological analytics:
*   **Pre-Trade Emotion:** A dropdown/slider (e.g., Calm, Anxious, Overconfident, Fearful of Missing Out).
*   **Post-Trade Emotion:** How they felt after the trade (e.g., Disciplined, Frustrated, Greedy, Relieved).
*   **Discipline Rating:** A 1-5 star rating on how strictly they followed their trading plan.
*   **Notes/Mindset Journal:** A rich text area for a quick brain dump before or after the trade.

#### C. Visual & Charting Features
*   **Chart Screenshot Upload:** Drag-and-drop area to upload image files (PNG/JPEG) of their chart setups for entry and exit.
*   **Interactive PnL Equity Curve:** A visual line graph showing account growth or drawdown over time.
*   **Win/Loss Visualizer:** A circular doughnut chart showing Win Rate % vs. Loss Rate %.

#### D. Market Context & News Integration
*   **Market Sentiment Tag:** A tag for what the overall market macro-trend was (e.g., Bullish, Bearish, Sideways/Choppy).
*   **News Catalyst Logger:** A text field or checklist to note major news events coinciding with the trade (e.g., FOMC meeting, CPI Release, Earnings, Crypto Hack).

### 3. Advanced Analytics & Insights Section
Create an "Insights" tab that aggregates data to show the user patterns:
*   **"Mistake Tracker":** Common tags like #ChasedThePump, #MovedStopLoss, #EarlyExit, #FOMO.
*   **Best/Worst Trading Days:** A calendar heatmap (like GitHub's contribution graph) showing green days vs. red days.
*   **Emotional Performance Correlation:** A chart showing which emotions result in the highest win rate vs. the biggest losses (e.g., "You lose 70% of trades when logged as 'Anxious'").

### 4. UI/UX Design Guidelines
*   **Theme:** Dark mode by default (sleek, cyberpunk/futuristic "AntiGravity" vibe—deep space grays, neon greens for profits, neon reds/pinks for losses).
*   **Layout:** A sidebar navigation (Dashboard, Journal, Analytics, Calendar, Settings).
*   **Responsiveness:** Must be fully responsive for mobile tracking on-the-go.

### 5. Step-by-Step Implementation Plan
Please start by generating the project structure, database schema (JSON or SQL format for Supabase), and the layout wrapper. Then, proceed to build out the individual components starting with the Trade Logging Form.