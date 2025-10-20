# Building a Professional Trading Decision Website with MoodMarket API

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [API Overview](#api-overview)
3. [Understanding the Data Structure](#understanding-the-data-structure)
4. [Architecture & Technology Stack](#architecture--technology-stack)
5. [Core Features for Professional Traders](#core-features-for-professional-traders)
6. [Implementation Guide](#implementation-guide)
7. [UI/UX Best Practices](#uiux-best-practices)
8. [Data Visualization Strategies](#data-visualization-strategies)
9. [Real-time Features](#real-time-features)
10. [Performance Optimization](#performance-optimization)
11. [Security & Compliance](#security--compliance)
12. [Deployment Strategy](#deployment-strategy)

---

## Executive Summary

The MoodMarket API provides comprehensive SEC filing data and AI-powered financial analysis for **7,900+ companies** with **8,526 filings** and **69+ AI analyses**. This guide will help you build a professional-grade trading decision platform that leverages this data to provide actionable investment insights.

### API Base URL

```
http://iw0g4808sw8ks4oco0k4gwsg.158.69.200.14.sslip.io/api
```

### Key Data Available

- **Companies**: 7,900 public companies with CIK, ticker, and metadata
- **Filings**: 10-K, 10-Q, 8-K, 6-K, 20-F, S-1 filings
- **AI Analyses**: Deep financial analysis with investment signals (buy/hold/sell recommendations)
- **Real-time Updates**: Fetch logs tracking data synchronization

---

## API Overview

### Core Endpoints

#### 1. Companies API

- **GET** `/companies` - List companies with search/filter
- **GET** `/companies/ticker/:ticker` - Get company by ticker (e.g., NVDA, AAPL)
- **GET** `/companies/:id/filings` - Get all filings for a company

#### 2. Filings API

- **GET** `/filings` - List filings with extensive filters
  - Filter by: `ticker`, `filing_type`, `from_date`, `to_date`, `has_analysis`
  - Sort by: `filing_date`, `report_date`
- **GET** `/filings/latest/:filing_type` - Latest 10-K, 10-Q, or 8-K filings
- **GET** `/filings/stats` - Filing statistics by type and year

#### 3. Analyses API (Most Important for Trading Decisions)

- **GET** `/analyses/latest` - Latest AI analyses with cursor pagination
- **GET** `/analyses/:id` - Full analysis with investment signals
- **GET** `/analyses/:id/metrics` - Financial metrics (10-K/10-Q only)
- **GET** `/analyses/:id/events` - Material events (8-K/6-K only)
- **GET** `/analyses/recommendations/summary` - Aggregate recommendations

#### 4. Dashboard & Search

- **GET** `/dashboard` - Overview statistics
- **GET** `/search?q=query` - Global search across companies/filings/analyses
- **GET** `/trending/companies` - Trending companies by filing activity

---

## Understanding the Data Structure

### Analysis Data Structure: Two Types

The API provides **two distinct analysis structures** based on filing type:

#### A. Periodic Reports (10-K, 10-Q, 20-F) - Comprehensive Financial Analysis

**12 Top-Level Keys:**

```json
{
  "metadata": {
    "ticker": "AXP",
    "company_name": "AMERICAN EXPRESS CO",
    "filing_type": "10-Q",
    "fiscal_year": "2025",
    "fiscal_quarter": "Q3",
    "period_end_date": "2025-09-30",
    "industry_sector": "Financial Services",
    "currency": "USD"
  },

  "income_statement": {
    "current_period": {
      "revenue": 18426,
      "net_income": 2902,
      "diluted_eps": 4.14,
      "operating_income": 3450
    },
    "growth_metrics": {
      "revenue_growth_pct": 10.76,
      "eps_growth_pct": 18.62,
      "net_income_growth_pct": 15.75
    },
    "margins": {
      "net_margin_pct": 15.75,
      "operating_margin_pct": 21.5
    }
  },

  "balance_sheet": {
    "current_period": {
      "assets": {
        "cash_and_equivalents": 54706,
        "total_assets": 270000
      },
      "liabilities": {
        "long_term_debt": 57787
      },
      "equity": {
        "total_shareholders_equity": 27000
      }
    }
  },

  "cash_flow_statement": {
    "current_period": {
      "free_cash_flow": 5000,
      "operating_activities": {},
      "investing_activities": {},
      "financing_activities": {}
    }
  },

  "key_metrics": {
    "profitability": {
      "net_margin_pct": 15.75,
      "return_on_equity_pct": 35.2,
      "return_on_assets_pct": 3.7,
      "operating_margin_pct": 21.5
    },
    "efficiency": {
      "asset_turnover": 1.2,
      "inventory_turnover": null,
      "receivables_turnover": 8.5
    },
    "liquidity": {
      "current_ratio": 1.5,
      "quick_ratio": 1.2,
      "working_capital": 15000
    },
    "leverage": {
      "debt_to_equity_ratio": 2.1,
      "debt_to_assets_ratio": 0.21,
      "total_debt": 57787
    },
    "per_share": {
      "eps_diluted": 4.14,
      "book_value_per_share": 45.2
    }
  },

  "segment_data": [
    {
      "name": "US Consumer Services",
      "revenue": 8500,
      "operating_income": 1852,
      "operating_margin_pct": 21.8
    }
  ],

  "geographic_data": [
    {
      "region": "United States",
      "revenue": 12000,
      "revenue_pct": 75.0
    }
  ],

  "shareholder_returns": {
    "dividends": {
      "dividend_per_share": 0.82,
      "dividend_yield_pct": 1.2,
      "payout_ratio_pct": 20.0,
      "yoy_dividend_growth_pct": 17.14
    },
    "share_repurchases": {
      "shares_repurchased": 5000000,
      "amount_spent": 1200000000
    }
  },

  "guidance_and_outlook": {
    "has_guidance": true,
    "guidance_period": "2025",
    "revenue_guidance": "10-12% growth",
    "earnings_guidance": "EPS $12-13",
    "management_commentary": "Strong momentum expected..."
  },

  "risk_factors": [
    {
      "category": "Credit Risk",
      "description": "Exposure to credit losses",
      "severity": "medium"
    }
  ],

  "sentiment_analysis": {
    "overall_sentiment": "bullish",
    "management_tone": "positive",
    "forward_momentum": "accelerating",
    "positive_indicators": ["Revenue growth >10%", "EPS growth >15%"],
    "negative_indicators": []
  },

  "investment_signal": {
    "recommendation": "buy",
    "confidence_pct": 85,
    "target_timeframe": "6-12 months",
    "financial_health_score": 85,
    "valuation_assessment": "fairly_valued",
    "investment_thesis": "American Express delivered strong Q3 results...",
    "strengths": ["Strong revenue growth", "Solid margins"],
    "weaknesses": ["Exposure to macro conditions"],
    "key_catalysts": ["Product launches", "Market expansion"],
    "key_risks": ["Competition", "Regulation"]
  }
}
```

#### B. Event Reports (8-K, 6-K) - Event-Driven Analysis

**7 Top-Level Keys:**

```json
{
  "metadata": {
    "ticker": "CSCO",
    "company_name": "CISCO SYSTEMS, INC.",
    "filing_type": "8-K",
    "fiscal_quarter": "Q4",
    "fiscal_year": "2025",
    "period_end_date": "2025-07-26",
    "industry_sector": "Technology",
    "currency": "USD"
  },

  "event_details": {
    "event_type": "Earnings Announcement",
    "item_numbers": ["2.02", "7.01"],
    "event_description": "Q4 and fiscal year 2025 results",
    "exhibits_referenced": ["99.1", "99.2"]
  },

  "material_events": {
    "acquisitions": [
      {
        "description": "Acquired XYZ Corp",
        "amount": 500000000,
        "currency": "USD"
      }
    ],
    "divestitures": [],
    "management_changes": [
      {
        "name": "John Doe",
        "position": "CFO",
        "change_type": "appointment",
        "effective_date": "2025-11-01"
      }
    ],
    "legal_regulatory": [],
    "other_material_events": []
  },

  "financial_snapshot": {
    "revenue": 16000,
    "net_income": 2500,
    "eps_diluted": 3.5,
    "revenue_growth_pct": 8.5,
    "data_completeness": "minimal"
  },

  "guidance_and_outlook": {
    "has_guidance": true,
    "guidance_items": ["2025 EPS guidance", "Revenue growth targets"],
    "key_statements": ["Management guidance for 2025 EPS and revenue growth"],
    "management_tone": "neutral"
  },

  "sentiment_analysis": {
    "overall_sentiment": "neutral",
    "market_relevance": "high",
    "positive_indicators": ["Strong execution"],
    "negative_indicators": ["Economic uncertainty"]
  },

  "investment_signal": {
    "recommendation": "hold",
    "confidence_pct": 50,
    "investment_thesis": "Neutral earnings announcement...",
    "event_significance": "major",
    "key_catalysts": ["Release of detailed Q3 results"],
    "key_risks": ["Global economic uncertainty", "Regulatory pressures"]
  }
}
```

---

## Architecture & Technology Stack

### Recommended Frontend Stack

#### Modern React-Based Stack (Recommended)

```
Framework:       Next.js 14+ (App Router)
Language:        TypeScript
Styling:         Tailwind CSS + shadcn/ui
State:           Zustand / TanStack Query
Charts:          Recharts / TradingView Lightweight Charts
Tables:          TanStack Table
API Client:      Axios / Fetch API
Deployment:      Vercel / Netlify
```

#### Alternative: Vue.js Stack

```
Framework:       Nuxt 3
Language:        TypeScript
Styling:         Tailwind CSS
State:           Pinia
Charts:          ApexCharts
Deployment:      Vercel / Netlify
```

### Architecture Pattern

```
┌─────────────────────────────────────────────────────────┐
│                      User Interface                      │
│  ┌──────────┬──────────┬──────────┬─────────────────┐  │
│  │Dashboard │Screener  │Company   │Portfolio Tracker│  │
│  │          │          │Analysis  │                 │  │
│  └──────────┴──────────┴──────────┴─────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────▼───────────┐
         │   API Service Layer   │
         │  (Axios/Fetch Wrapper)│
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────────────┐
         │  MoodMarket API               │
         │  /api/companies               │
         │  /api/filings                 │
         │  /api/analyses                │
         │  /api/dashboard               │
         └───────────────────────────────┘
```

---

## Core Features for Professional Traders

### 1. **Real-Time Analysis Feed**

**Priority: CRITICAL**

Display the latest AI analyses as they're generated, similar to a financial news feed.

**Implementation:**

```typescript
// API Call
GET /api/analyses/latest?limit=20

// Key Data to Display:
- Company ticker + name
- Filing type (10-K, 10-Q, 8-K)
- Investment recommendation (buy/hold/sell)
- Confidence percentage
- Financial health score
- Time since analysis

// Features:
- Infinite scroll (cursor-based pagination)
- Real-time updates (polling every 30s or WebSocket)
- Filter by recommendation (buy/hold/sell)
- Filter by confidence level (>70%, >80%)
```

**Example Card Layout:**

```
┌─────────────────────────────────────────────┐
│ NVDA - NVIDIA CORP              [BUY 85%]  │
│ 10-Q Filing • Q3 2025          ⭐⭐⭐⭐⭐    │
│                                             │
│ Financial Health: 92/100                    │
│ Valuation: Undervalued                      │
│                                             │
│ 📈 Revenue Growth: +122.4% YoY              │
│ 💰 Net Margin: 62.1%                        │
│ 💵 EPS Growth: +168%                        │
│                                             │
│ ✅ AI-powered data center demand            │
│ ✅ Market leadership in GPU                 │
│ ⚠️  High valuation multiples                │
│                                             │
│ [View Full Analysis] [Add to Watchlist]    │
└─────────────────────────────────────────────┘
```

---

### 2. **Advanced Stock Screener**

**Priority: CRITICAL**

Filter companies based on financial metrics and AI recommendations.

**Implementation:**

```typescript
// Filter Criteria:
- Investment Recommendation: [buy, hold, sell]
- Confidence Level: >50%, >70%, >85%
- Financial Health Score: >70, >80, >90
- Revenue Growth: >10%, >20%, >50%
- Net Margin: >10%, >15%, >20%
- Market Cap: Small/Mid/Large
- Industry Sector: Technology, Financial Services, etc.
- Filing Type: 10-K, 10-Q, 8-K
- Has Guidance: Yes/No
- Valuation: Undervalued, Fairly Valued, Overvalued
```

**API Strategy:**

```typescript
// Option 1: Client-side filtering (if dataset is small)
GET /api/analyses?limit=100

// Option 2: Server-side filtering (recommended)
GET /api/analyses?recommendation=buy&min_confidence=70&min_score=80

// Advanced Search
POST /api/search/advanced
{
  "analyses": {
    "recommendations": ["buy", "strong_buy"],
    "min_confidence": 70,
    "min_financial_health_score": 80
  }
}
```

**UI Components:**

- Multi-select dropdown filters
- Range sliders for metrics
- Save custom screens
- Export results to CSV

---

### 3. **Company Deep Dive Dashboard**

**Priority: CRITICAL**

Comprehensive analysis page for individual companies.

**Data Sources:**

```typescript
// 1. Company Info
GET /api/companies/ticker/:ticker

// 2. Latest Filings
GET /api/filings?ticker=NVDA&limit=10&sort=filing_date&order=desc

// 3. All Analyses
GET /api/companies/:id/analyses

// 4. Latest 10-K Analysis
GET /api/analyses/:id?include_full_data=true

// 5. Financial Metrics
GET /api/analyses/:id/metrics
```

**Page Sections:**

#### A. Header Section

```
┌────────────────────────────────────────────────┐
│ NVDA - NVIDIA CORP              [★ Watchlist] │
│ Technology • Market Cap: $2.8T • CIK: 0001045810│
│                                                 │
│ Latest Rating: BUY (85% confidence)             │
│ Financial Health: 92/100 ⭐⭐⭐⭐⭐              │
└────────────────────────────────────────────────┘
```

#### B. Key Metrics Dashboard (10-K/10-Q Only)

```
┌─────────────────────────────────────────────┐
│ FINANCIAL PERFORMANCE                       │
├─────────────────────────────────────────────┤
│ Revenue:        $35.0B  (+122.4% YoY) 📈    │
│ Net Income:     $14.9B  (+168.0% YoY) 📈    │
│ EPS (Diluted):  $0.60   (+152.0% YoY) 📈    │
│                                             │
│ PROFITABILITY METRICS                       │
│ Gross Margin:      75.1%  [█████████░] 90%  │
│ Operating Margin:  62.1%  [████████░░] 80%  │
│ Net Margin:        55.3%  [████████░░] 80%  │
│ ROE:               35.2%  [███████░░░] 70%  │
│ ROA:                3.7%  [██░░░░░░░░] 20%  │
│                                             │
│ LIQUIDITY & LEVERAGE                        │
│ Current Ratio:     1.5x   ✅ Healthy        │
│ Debt/Equity:       0.21   ✅ Low Debt       │
│ Free Cash Flow:    $5.0B  ✅ Strong         │
└─────────────────────────────────────────────┘
```

#### C. Investment Thesis

Display the AI-generated investment thesis prominently:

```
┌─────────────────────────────────────────────┐
│ 🤖 AI INVESTMENT THESIS                     │
├─────────────────────────────────────────────┤
│ NVIDIA delivered exceptional Q3 results     │
│ driven by explosive data center demand.     │
│ The company maintains market leadership in  │
│ AI accelerators with 95%+ market share...   │
│                                             │
│ Target Timeframe: 6-12 months               │
│ Valuation: Fairly Valued                    │
└─────────────────────────────────────────────┘
```

#### D. Strengths & Weaknesses

```
┌─────────────────────────────────────────────┐
│ STRENGTHS ✅                                │
│ • Revenue growth >100% YoY                  │
│ • Market leader in AI/GPU                   │
│ • Strong gross margins (75%+)               │
│ • Robust free cash flow generation          │
│                                             │
│ WEAKNESSES ⚠️                                │
│ • High valuation multiples                  │
│ • Cyclical semiconductor exposure           │
│ • Geographic concentration risk             │
└─────────────────────────────────────────────┘
```

#### E. Segment Analysis

```
┌─────────────────────────────────────────────┐
│ BUSINESS SEGMENTS                           │
├─────────────────────────────────────────────┤
│ Data Center        $28.0B  [████████░] 80%  │
│ Gaming              $2.9B  [██░░░░░░░] 20%  │
│ Professional Viz    $1.5B  [█░░░░░░░░] 10%  │
│ Automotive          $1.0B  [░░░░░░░░░]  5%  │
└─────────────────────────────────────────────┘
```

#### F. Risk Factors

```
┌─────────────────────────────────────────────┐
│ RISK ANALYSIS                               │
├─────────────────────────────────────────────┤
│ 🔴 HIGH: Cyclical demand for semiconductors │
│ 🟡 MEDIUM: Export restrictions to China     │
│ 🟡 MEDIUM: Competition from AMD, Intel      │
│ 🟢 LOW: Supply chain disruptions            │
└─────────────────────────────────────────────┘
```

#### G. Historical Filings Timeline

```
┌─────────────────────────────────────────────┐
│ FILING HISTORY                              │
├─────────────────────────────────────────────┤
│ 2025-10-15  10-Q Q3 2025  [BUY 85%] [View] │
│ 2025-07-20  10-Q Q2 2025  [BUY 82%] [View] │
│ 2025-04-15  10-Q Q1 2025  [BUY 78%] [View] │
│ 2025-02-26  10-K FY 2024  [BUY 88%] [View] │
│ 2024-11-18  8-K  Earnings [HOLD 65%][View] │
└─────────────────────────────────────────────┘
```

---

### 4. **Material Events Tracker** (8-K/6-K Focus)

**Priority: HIGH**

Track significant corporate events that impact trading decisions.

**Implementation:**

```typescript
// Get all event analyses
GET /api/analyses/events?limit=50

// Get material events summary
GET /api/analyses/events/material?ticker=AAPL

// Filter by event type
GET /api/analyses/events?event_type=acquisition&event_significance=major
```

**Event Categories to Display:**

- **Acquisitions** - M&A activity
- **Management Changes** - CEO, CFO appointments/departures
- **Legal/Regulatory** - Lawsuits, SEC investigations
- **Earnings Announcements** - Quarterly results
- **Guidance Updates** - Forward-looking statements

**UI Layout:**

```
┌──────────────────────────────────────────────┐
│ AAPL - Apple Inc.                 2025-10-15 │
│ 8-K Filing: Management Change                │
│                                              │
│ Event Significance: ⭐⭐⭐ MAJOR              │
│                                              │
│ CFO Luca Maestri to step down in Q1 2026.   │
│ Kevan Parekh appointed as successor.        │
│                                              │
│ Impact: Neutral (orderly transition planned) │
│ Recommendation: HOLD                         │
└──────────────────────────────────────────────┘
```

---

### 5. **Sentiment & Trend Analysis Dashboard**

**Priority: MEDIUM**

Aggregate view of market sentiment across sectors and recommendations.

**Implementation:**

```typescript
// Get recommendations summary
GET /api/analyses/recommendations/summary

// By sector
GET /api/analyses/recommendations/summary?sector=Technology

// Time-series data (by date range)
GET /api/analyses?from_date=2025-01-01&to_date=2025-12-31
```

**Visualizations:**

#### A. Recommendation Distribution

```
Pie Chart:
- Strong Buy: 12 (15%)
- Buy: 45 (55%)
- Hold: 30 (37%)
- Sell: 10 (12%)
- Strong Sell: 5 (6%)
```

#### B. Sector Sentiment Heatmap

```
               Bullish  Neutral  Bearish
Technology       55%      30%      15%
Financials       40%      35%      25%
Healthcare       45%      40%      15%
Energy           30%      45%      25%
```

#### C. Average Confidence by Recommendation

```
Bar Chart:
Buy:  78% confidence (avg)
Hold: 65% confidence (avg)
Sell: 72% confidence (avg)
```

---

### 6. **Portfolio Tracking & Alerts**

**Priority: MEDIUM**

Allow users to track companies and receive notifications on new analyses.

**Features:**

- Watchlist management (add/remove tickers)
- Email/push notifications on new analyses
- Portfolio performance tracking
- Custom alerts (e.g., "Notify me when NVDA gets a BUY rating >85%")

**Local Storage Schema:**

```typescript
interface Watchlist {
  userId: string;
  tickers: string[];
  alertSettings: {
    ticker: string;
    minConfidence?: number;
    recommendations?: ('buy' | 'hold' | 'sell')[];
    notifyOnFilings?: boolean;
  }[];
}
```

---

### 7. **Comparative Analysis Tool**

**Priority: LOW**

Compare multiple companies side-by-side.

**Implementation:**

```typescript
// Compare analyses
GET /api/analyses/compare?ids=1,2,3

// Compare companies
GET /api/analytics/compare?tickers=NVDA,AMD,INTC&metrics=revenue,net_income,margins
```

**UI Layout:**

```
┌─────────────┬─────────┬─────────┬─────────┐
│ Metric      │  NVDA   │   AMD   │  INTC   │
├─────────────┼─────────┼─────────┼─────────┤
│ Rating      │  BUY    │  HOLD   │  SELL   │
│ Confidence  │  85%    │  65%    │  55%    │
│ Revenue     │ $35.0B  │ $22.0B  │ $54.0B  │
│ Growth      │ +122%   │  +10%   │  -15%   │
│ Net Margin  │ 55.3%   │ 15.2%   │  8.5%   │
│ ROE         │ 35.2%   │ 12.5%   │  5.3%   │
└─────────────┴─────────┴─────────┴─────────┘
```

---

## Implementation Guide

### Step 1: Project Setup

```bash
# Create Next.js project
npx create-next-app@latest moodmarket-trader --typescript --tailwind --app

# Install dependencies
cd moodmarket-trader
npm install axios zustand @tanstack/react-query recharts @tanstack/react-table
npm install lucide-react date-fns clsx tailwind-merge
npm install -D @types/node
```

### Step 2: API Service Layer

Create a centralized API client:

```typescript
// lib/api/client.ts
import axios from 'axios';

const API_BASE_URL = 'http://iw0g4808sw8ks4oco0k4gwsg.158.69.200.14.sslip.io/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

```typescript
// lib/api/analyses.ts
import { apiClient } from './client';

export interface Analysis {
  id: number;
  filing_id: number;
  model_used: string;
  analysis_completed_at: string;
  analysis_data: {
    metadata: {
      ticker: string;
      company_name: string;
      filing_type: string;
      fiscal_quarter?: string;
      fiscal_year?: string;
    };
    investment_signal: {
      recommendation: 'buy' | 'hold' | 'sell' | 'strong_buy' | 'strong_sell';
      confidence_pct: number;
      financial_health_score?: number;
      valuation_assessment?: string;
      investment_thesis: string;
      strengths: string[];
      weaknesses: string[];
      key_catalysts: string[];
      key_risks: string[];
    };
    income_statement?: any;
    key_metrics?: any;
  };
  ticker: string;
  company_title: string;
  filing_type: string;
}

export const analysesApi = {
  // Get latest analyses with cursor pagination
  getLatest: async (limit = 20, cursor?: string) => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) params.append('cursor', cursor);

    const response = await apiClient.get(`/analyses/latest?${params}`);
    return response.data;
  },

  // Get analysis by ID
  getById: async (id: number, includeFullData = true) => {
    const response = await apiClient.get(`/analyses/${id}`, {
      params: { include_full_data: includeFullData },
    });
    return response.data;
  },

  // Get financial metrics (10-K/10-Q only)
  getMetrics: async (id: number) => {
    const response = await apiClient.get(`/analyses/${id}/metrics`);
    return response.data;
  },

  // Get event details (8-K/6-K only)
  getEvents: async (id: number) => {
    const response = await apiClient.get(`/analyses/${id}/events`);
    return response.data;
  },

  // Search analyses
  search: async (filters: {
    ticker?: string;
    recommendation?: string;
    min_confidence?: number;
    filing_type?: string;
    from_date?: string;
    to_date?: string;
  }) => {
    const response = await apiClient.get('/analyses', { params: filters });
    return response.data;
  },

  // Get recommendations summary
  getRecommendationsSummary: async (ticker?: string) => {
    const response = await apiClient.get('/analyses/recommendations/summary', {
      params: { ticker },
    });
    return response.data;
  },
};
```

```typescript
// lib/api/companies.ts
import { apiClient } from './client';

export const companiesApi = {
  search: async (query: string, limit = 10) => {
    const response = await apiClient.get('/companies', {
      params: { search: query, limit },
    });
    return response.data;
  },

  getByTicker: async (ticker: string) => {
    const response = await apiClient.get(`/companies/ticker/${ticker}`);
    return response.data;
  },

  getFilings: async (id: number, filters?: any) => {
    const response = await apiClient.get(`/companies/${id}/filings`, {
      params: filters,
    });
    return response.data;
  },
};
```

### Step 3: React Query Setup

```typescript
// lib/hooks/useAnalyses.ts
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { analysesApi } from '../api/analyses';

export const useLatestAnalyses = (limit = 20) => {
  return useInfiniteQuery({
    queryKey: ['analyses', 'latest', limit],
    queryFn: ({ pageParam }) => analysesApi.getLatest(limit, pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.cursor.hasMore ? lastPage.cursor.next : undefined;
    },
    initialPageParam: undefined,
  });
};

export const useAnalysis = (id: number) => {
  return useQuery({
    queryKey: ['analysis', id],
    queryFn: () => analysesApi.getById(id),
  });
};

export const useAnalysisMetrics = (id: number) => {
  return useQuery({
    queryKey: ['analysis', id, 'metrics'],
    queryFn: () => analysesApi.getMetrics(id),
  });
};
```

### Step 4: UI Components

#### Analysis Card Component

```tsx
// components/AnalysisCard.tsx
import { Analysis } from '@/lib/api/analyses';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface AnalysisCardProps {
  analysis: Analysis;
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const { metadata, investment_signal } = analysis.analysis_data;
  const { recommendation, confidence_pct, financial_health_score } = investment_signal;

  const getRecommendationColor = (rec: string) => {
    if (rec === 'buy' || rec === 'strong_buy') return 'text-green-600 bg-green-50';
    if (rec === 'sell' || rec === 'strong_sell') return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">
            {metadata.ticker} - {metadata.company_name}
          </h3>
          <p className="text-sm text-gray-500">
            {metadata.filing_type} Filing • {metadata.fiscal_quarter} {metadata.fiscal_year}
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full font-semibold ${getRecommendationColor(recommendation)}`}
        >
          {recommendation.toUpperCase()} {confidence_pct}%
        </div>
      </div>

      {financial_health_score && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">Financial Health Score</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${financial_health_score}%` }}
              />
            </div>
            <span className="font-bold">{financial_health_score}/100</span>
          </div>
        </div>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <ArrowUpIcon className="w-4 h-4 text-green-600" />
          <span className="font-semibold">Strengths:</span>
        </div>
        <ul className="text-sm text-gray-700 ml-6 list-disc">
          {investment_signal.strengths.slice(0, 3).map((strength, i) => (
            <li key={i}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          View Full Analysis
        </button>
        <button className="px-4 border rounded hover:bg-gray-50">Add to Watchlist</button>
      </div>
    </div>
  );
}
```

#### Dashboard Page

```tsx
// app/page.tsx
'use client';

import { useLatestAnalyses } from '@/lib/hooks/useAnalyses';
import { AnalysisCard } from '@/components/AnalysisCard';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default function DashboardPage() {
  const { data, fetchNextPage, hasNextPage, isLoading } = useLatestAnalyses(20);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return <div>Loading analyses...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Latest AI Analyses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.pages.map((page) =>
          page.data.map((analysis) => <AnalysisCard key={analysis.id} analysis={analysis} />)
        )}
      </div>

      <div ref={ref} className="h-10" />
    </div>
  );
}
```

---

## UI/UX Best Practices

### Color System for Trading Signals

```css
/* Recommendations */
.strong-buy {
  background: #16a34a;
  color: white;
} /* Green 600 */
.buy {
  background: #22c55e;
  color: white;
} /* Green 500 */
.hold {
  background: #6b7280;
  color: white;
} /* Gray 500 */
.sell {
  background: #ef4444;
  color: white;
} /* Red 500 */
.strong-sell {
  background: #dc2626;
  color: white;
} /* Red 600 */

/* Confidence Levels */
.confidence-high {
  border-left: 4px solid #16a34a;
} /* >80% */
.confidence-medium {
  border-left: 4px solid #eab308;
} /* 60-80% */
.confidence-low {
  border-left: 4px solid #ef4444;
} /* <60% */

/* Financial Health Score */
.health-excellent {
  color: #16a34a;
} /* 90-100 */
.health-good {
  color: #22c55e;
} /* 75-89 */
.health-fair {
  color: #eab308;
} /* 60-74 */
.health-poor {
  color: #ef4444;
} /* <60 */
```

### Responsive Design Priorities

1. **Mobile First**: Analysis cards stack vertically
2. **Tablet**: 2-column grid for analysis cards
3. **Desktop**: 3-column grid + sidebar for filters
4. **Large Desktop**: Full dashboard with multiple panels

### Accessibility

- Use semantic HTML (`<article>`, `<section>`, `<nav>`)
- ARIA labels for icon buttons
- Keyboard navigation for all interactive elements
- High contrast mode support
- Screen reader-friendly metric descriptions

---

## Data Visualization Strategies

### 1. Financial Performance Charts (10-K/10-Q Data)

#### Revenue & Income Trends

```typescript
// Line chart showing quarterly revenue/income growth
{
  xAxis: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025'],
  series: [
    { name: 'Revenue', data: [20000, 22000, 26000, 30000, 35000] },
    { name: 'Net Income', data: [5000, 6000, 8000, 10000, 14000] }
  ]
}
```

#### Profitability Metrics Bar Chart

```typescript
// Compare company's margins against industry average
{
  categories: ['Gross Margin', 'Operating Margin', 'Net Margin'],
  series: [
    { name: 'NVDA', data: [75.1, 62.1, 55.3] },
    { name: 'Industry Avg', data: [55.0, 35.0, 20.0] }
  ]
}
```

#### Balance Sheet Visualization

```typescript
// Stacked area chart for assets/liabilities/equity
{
  xAxis: ['2023', '2024', '2025'],
  series: [
    { name: 'Total Assets', data: [200000, 250000, 300000] },
    { name: 'Total Liabilities', data: [50000, 60000, 70000] },
    { name: 'Shareholders Equity', data: [150000, 190000, 230000] }
  ]
}
```

### 2. Segment Analysis (Pie/Donut Charts)

```typescript
// Business segment revenue distribution
{
  labels: ['Data Center', 'Gaming', 'Professional Viz', 'Automotive'],
  data: [28000, 2900, 1500, 1000],
  percentages: [84%, 9%, 4%, 3%]
}
```

### 3. Geographic Revenue Map

Use a choropleth map or bar chart:

```typescript
{
  regions: ['United States', 'Europe', 'Asia-Pacific', 'Other'],
  revenue: [12000, 5000, 7000, 1000],
  percentages: [48%, 20%, 28%, 4%]
}
```

### 4. Recommendation Distribution (Dashboard)

```typescript
// Donut chart for overall market sentiment
{
  labels: ['Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell'],
  data: [12, 45, 30, 10, 5],
  colors: ['#16a34a', '#22c55e', '#6b7280', '#ef4444', '#dc2626']
}
```

### 5. Confidence Score Gauge

```tsx
// Radial gauge for confidence percentage
<RadialGauge
  value={85}
  min={0}
  max={100}
  label="Confidence"
  colorRanges={[
    { from: 0, to: 60, color: '#ef4444' },
    { from: 60, to: 80, color: '#eab308' },
    { from: 80, to: 100, color: '#16a34a' },
  ]}
/>
```

---

## Real-time Features

### 1. Auto-Refresh Latest Analyses

```typescript
// Poll for new analyses every 30 seconds
import { useQuery } from '@tanstack/react-query';

export const useLatestAnalysesPolling = () => {
  return useQuery({
    queryKey: ['analyses', 'latest'],
    queryFn: () => analysesApi.getLatest(10),
    refetchInterval: 30000, // 30 seconds
  });
};
```

### 2. WebSocket Implementation (Future Enhancement)

If the API adds WebSocket support:

```typescript
const ws = new WebSocket('wss://api.moodmarket.com/ws');

ws.onmessage = (event) => {
  const analysis = JSON.parse(event.data);
  // Update UI with new analysis
  queryClient.setQueryData(['analyses', 'latest'], (old) => {
    return [analysis, ...old];
  });
};
```

### 3. Push Notifications

Use Web Push API for browser notifications:

```typescript
// Request permission
Notification.requestPermission().then((permission) => {
  if (permission === 'granted') {
    // Show notification when new analysis matches watchlist
    new Notification('New Analysis for NVDA', {
      body: 'BUY recommendation with 85% confidence',
      icon: '/logo.png',
    });
  }
});
```

---

## Performance Optimization

### 1. Data Caching Strategy

```typescript
// React Query default config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});
```

### 2. Virtual Scrolling for Large Lists

Use `react-window` or `@tanstack/react-virtual`:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const rowVirtualizer = useVirtualizer({
  count: analyses.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 200, // Estimated row height
});
```

### 3. Image Optimization

```tsx
// Next.js Image component
import Image from 'next/image';

<Image src="/company-logos/nvda.png" alt="NVIDIA" width={48} height={48} loading="lazy" />;
```

### 4. Code Splitting

```typescript
// Lazy load heavy components
const CompanyDashboard = dynamic(() => import('@/components/CompanyDashboard'), {
  loading: () => <Skeleton />,
});
```

### 5. API Response Optimization

- Use `limit` parameter wisely (20-50 items per page)
- Only fetch `include_full_data=true` when needed
- Implement cursor-based pagination for infinite scroll

---

## Security & Compliance

### 1. Data Privacy

- **No PII Storage**: API doesn't contain personal information
- **Cookie Consent**: If using analytics (Google Analytics, Mixpanel)
- **GDPR Compliance**: Allow users to export/delete watchlist data

### 2. API Rate Limiting

Handle rate limit errors gracefully:

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      // Rate limited - show user-friendly message
      toast.error('Too many requests. Please wait a moment.');
    }
    return Promise.reject(error);
  }
);
```

### 3. Input Validation

Sanitize user inputs:

```typescript
import DOMPurify from 'dompurify';

const sanitizedQuery = DOMPurify.sanitize(userInput);
```

### 4. SEC Disclaimer

Display prominently:

```
⚠️ DISCLAIMER: This website provides AI-generated financial analysis
based on SEC filings. This is NOT financial advice. Always conduct
your own due diligence and consult with a licensed financial advisor
before making investment decisions.
```

### 5. Terms of Service

Include:

- Data source attribution (SEC EDGAR)
- AI model disclaimer
- No warranty clause
- User responsibilities

---

## Deployment Strategy

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Environment Variables:**

- `NEXT_PUBLIC_API_BASE_URL=http://iw0g4808sw8ks4oco0k4gwsg.158.69.200.14.sslip.io/api`

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Option 3: Docker + Cloud Run / Fly.io

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Deploy to Google Cloud Run
gcloud run deploy moodmarket-trader \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Performance Monitoring

Integrate monitoring tools:

- **Vercel Analytics** (built-in)
- **Google Analytics 4**
- **Sentry** for error tracking
- **LogRocket** for session replay

---

## Advanced Features (Future Enhancements)

### 1. AI-Powered Chatbot

Integrate OpenAI API to answer questions:

```
User: "What's the latest analysis for NVIDIA?"
Bot: "NVIDIA (NVDA) received a BUY rating with 85% confidence
based on their Q3 2025 10-Q filing. Key strengths include
122% revenue growth and market leadership in AI GPUs."
```

### 2. Portfolio Backtesting

Allow users to simulate portfolio performance:

- Input initial investment amount
- Track historical recommendations
- Calculate returns if followed

### 3. Custom Alerts & Webhooks

```typescript
interface Alert {
  type: 'recommendation' | 'confidence' | 'filing';
  ticker: string;
  condition: {
    recommendation?: 'buy' | 'hold' | 'sell';
    minConfidence?: number;
    filingType?: string;
  };
  notificationMethod: 'email' | 'push' | 'webhook';
  webhookUrl?: string;
}
```

### 4. PDF Report Generation

Generate downloadable investment reports:

```typescript
import { jsPDF } from 'jspdf';

const generateReport = (analysis: Analysis) => {
  const doc = new jsPDF();
  doc.text(`Investment Analysis: ${analysis.ticker}`, 10, 10);
  doc.text(`Recommendation: ${analysis.investment_signal.recommendation}`, 10, 20);
  // Add charts, metrics, etc.
  doc.save(`${analysis.ticker}_analysis.pdf`);
};
```

### 5. Social Features

- Share analyses on Twitter/LinkedIn
- Discussion forums for each company
- User-generated notes/annotations

### 6. API Proxy Layer (Recommended)

Create your own backend to:

- Cache API responses
- Implement user authentication
- Track usage analytics
- Add custom business logic

```typescript
// Next.js API Route
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get('ticker');

  // Check cache first
  const cached = await redis.get(`company:${ticker}`);
  if (cached) return Response.json(cached);

  // Fetch from MoodMarket API
  const data = await fetch(`${API_BASE}/companies/ticker/${ticker}`);
  const json = await data.json();

  // Cache for 5 minutes
  await redis.set(`company:${ticker}`, json, { ex: 300 });

  return Response.json(json);
}
```

---

## Sample Implementation Timeline

### Week 1: Foundation

- [x] Set up Next.js project
- [x] Implement API service layer
- [x] Create basic layout (header, sidebar, footer)
- [x] Build analysis card component

### Week 2: Core Features

- [x] Latest analyses feed (infinite scroll)
- [x] Company search
- [x] Basic stock screener (client-side filtering)
- [x] Company detail page (header + key metrics)

### Week 3: Advanced Features

- [x] Financial charts (Recharts integration)
- [x] Material events tracker
- [x] Sentiment dashboard
- [x] Watchlist functionality (localStorage)

### Week 4: Polish & Deploy

- [x] Responsive design refinement
- [x] Loading states & error handling
- [x] Performance optimization
- [x] Deploy to Vercel
- [x] Add analytics

---

## Conclusion

This guide provides a comprehensive roadmap for building a professional trading decision website using the MoodMarket API. The key to success is:

1. **Focus on actionable insights**: Display investment signals prominently
2. **Optimize for speed**: Fast load times are critical for traders
3. **Make data scannable**: Use visual hierarchy and color coding
4. **Mobile-first design**: Many traders work on mobile devices
5. **Trust & transparency**: Always disclose AI-generated nature and limitations

### Key Differentiators for Your Platform

- **Real-time AI insights**: Unlike traditional financial sites, you have AI-powered analysis
- **Event-driven trading**: 8-K tracking provides edge on breaking news
- **Comprehensive metrics**: 12-point analysis framework (10-K/10-Q)
- **Free & accessible**: SEC data is public, make it easy to understand

### Next Steps

1. **Start with MVP**: Latest analyses feed + company search + detail pages
2. **Gather feedback**: Share with beta users (Reddit r/stocks, r/wallstreetbets)
3. **Iterate based on usage**: Track which metrics users engage with most
4. **Monetize strategically**: Premium features (alerts, portfolio tracking, API access)

Good luck building your trading platform! 🚀📈
