# MoodMarket API Routes Documentation

## Database Overview

The database contains **5 main tables** with the following data:

- **Companies**: 7,900 records
- **Filings**: 8,526 records (10-K, 10-Q, 8-K, 6-K, 20-F, S-1)
- **Analyses**: 69 AI-generated financial analyses
- **Ticker Aliases**: 10,142 ticker mappings
- **Fetch Logs**: 172 data sync logs

### Analysis Types by Filing Type

**IMPORTANT**: The analysis structure differs significantly based on filing type:

#### Periodic Reports (10-K, 10-Q, 20-F) - Comprehensive Financial Analysis

- **34 8-K analyses**
- **34 6-K analyses**
- **1 10-Q analysis**
- **1 10-K analysis**

**10-K/10-Q Analysis Structure** (12 top-level keys):

- `metadata` - Filing information
- `income_statement` - Full income statement data
- `balance_sheet` - Complete balance sheet
- `cash_flow_statement` - Cash flow details
- `key_metrics` - Profitability, efficiency, liquidity, leverage, per_share metrics
- `segment_data` - Business segment breakdown
- `geographic_data` - Geographic revenue/operations
- `shareholder_returns` - Dividends, buybacks, yield
- `guidance_and_outlook` - Forward-looking statements
- `risk_factors` - Identified risk factors
- `sentiment_analysis` - Overall tone and indicators
- `investment_signal` - Buy/hold/sell recommendation with `strengths`, `weaknesses`, `financial_health_score`, `valuation_assessment`, `target_timeframe`

#### Event Reports (8-K, 6-K) - Event-Driven Analysis

**8-K/6-K Analysis Structure** (7 top-level keys):

- `metadata` - Filing information
- `event_details` - Event type, item numbers, exhibits
- `material_events` - Acquisitions, divestitures, legal/regulatory, management changes
- `financial_snapshot` - Limited financial data (often null for non-earnings 8-Ks)
- `guidance_and_outlook` - Management commentary
- `sentiment_analysis` - Market relevance and tone
- `investment_signal` - Recommendation with `event_significance` (major/minor), `key_catalysts`, `key_risks`

---

## 1. Company Routes

### 1.1 List Companies

**GET** `/api/companies`

Query Parameters:

- `page` (integer, default: 1)
- `limit` (integer, default: 50, max: 100)
- `search` (string) - Search by ticker or company name
- `sort` (string) - `ticker`, `title`, `created_at` (default: `ticker`)
- `order` (string) - `asc`, `desc` (default: `asc`)

Response:

```json
{
  "data": [
    {
      "id": 1,
      "cik": "0001045810",
      "ticker": "NVDA",
      "title": "NVIDIA CORP",
      "created_at": "2025-10-19T11:53:53.569Z",
      "updated_at": "2025-10-19T11:53:53.569Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 7900,
    "totalPages": 158
  }
}
```

### 1.2 Get Company by ID

**GET** `/api/companies/:id`

Response:

```json
{
  "id": 1,
  "cik": "0001045810",
  "ticker": "NVDA",
  "title": "NVIDIA CORP",
  "created_at": "2025-10-19T11:53:53.569Z",
  "updated_at": "2025-10-19T11:53:53.569Z",
  "aliases": [
    {
      "ticker": "NVDA",
      "is_primary": true
    }
  ],
  "stats": {
    "total_filings": 45,
    "total_analyses": 3,
    "latest_filing_date": "2025-10-17"
  }
}
```

### 1.3 Get Company by Ticker

**GET** `/api/companies/ticker/:ticker`

Response: Same as 1.2

### 1.4 Get Company by CIK

**GET** `/api/companies/cik/:cik`

Response: Same as 1.2

### 1.5 Create Company

**POST** `/api/companies`

Request Body:

```json
{
  "cik": "0001234567",
  "ticker": "AAPL",
  "title": "Apple Inc."
}
```

Response: Created company object (201)

### 1.6 Update Company

**PUT** `/api/companies/:id`

Request Body:

```json
{
  "ticker": "AAPL",
  "title": "Apple Inc. (Updated)"
}
```

Response: Updated company object (200)

### 1.7 Delete Company

**DELETE** `/api/companies/:id`

Response: 204 No Content

---

## 2. Ticker Alias Routes

### 2.1 List All Ticker Aliases

**GET** `/api/ticker-aliases`

Query Parameters:

- `page` (integer)
- `limit` (integer)
- `company_id` (integer) - Filter by company
- `ticker` (string) - Search by ticker
- `is_primary` (boolean) - Filter primary tickers only

Response:

```json
{
  "data": [
    {
      "id": 33,
      "company_id": 21,
      "ticker": "PLTR",
      "is_primary": true,
      "created_at": "2025-10-19T11:54:23.625Z"
    }
  ],
  "pagination": {}
}
```

### 2.2 Get Aliases for Company

**GET** `/api/companies/:id/aliases`

Response:

```json
{
  "company_id": 40,
  "primary_ticker": "CYATY",
  "aliases": [
    {
      "id": 90,
      "ticker": "CYATY",
      "is_primary": true,
      "created_at": "2025-10-19T11:54:59.646Z"
    },
    {
      "id": 91,
      "ticker": "CTATF",
      "is_primary": false,
      "created_at": "2025-10-19T11:54:59.960Z"
    }
  ]
}
```

### 2.3 Create Ticker Alias

**POST** `/api/ticker-aliases`

Request Body:

```json
{
  "company_id": 40,
  "ticker": "CTATF",
  "is_primary": false
}
```

Response: Created alias (201)

### 2.4 Update Ticker Alias

**PUT** `/api/ticker-aliases/:id`

Request Body:

```json
{
  "is_primary": true
}
```

Response: Updated alias (200)

### 2.5 Delete Ticker Alias

**DELETE** `/api/ticker-aliases/:id`

Response: 204 No Content

---

## 3. Filing Routes

### 3.1 List Filings

**GET** `/api/filings`

Query Parameters:

- `page` (integer)
- `limit` (integer)
- `company_id` (integer) - Filter by company
- `cik` (string) - Filter by CIK
- `ticker` (string) - Filter by ticker (resolved via company)
- `filing_type` (string) - `10-K`, `10-Q`, `8-K`, `6-K`, `20-F`, `S-1`
- `from_date` (date) - Filing date start range
- `to_date` (date) - Filing date end range
- `latest_only` (boolean) - Get only latest filings per type
- `is_latest_10k` (boolean)
- `is_latest_10q` (boolean)
- `is_latest_8k` (boolean)
- `is_latest_6k` (boolean)
- `is_latest_20f` (boolean)
- `is_latest_s1` (boolean)
- `has_analysis` (boolean) - Filter filings with/without analysis
- `sort` (string) - `filing_date`, `report_date`, `created_at`
- `order` (string) - `asc`, `desc` (default: `desc`)

Response:

```json
{
  "data": [
    {
      "id": 9,
      "company_id": 1,
      "cik": "0001045810",
      "accession_number": "0001045810-25-000023",
      "filing_type": "10-K",
      "filing_date": "2025-02-26",
      "report_date": "2025-01-26",
      "primary_document": "nvda-20250126.htm",
      "document_url": "https://...",
      "filing_url": "https://...",
      "is_latest_10k": true,
      "is_latest_10q": false,
      "is_latest_8k": false,
      "is_latest_6k": false,
      "is_latest_20f": false,
      "is_latest_s1": false,
      "created_at": "2025-10-19T11:53:53.569Z",
      "updated_at": "2025-10-19T11:53:53.569Z",
      "company": {
        "ticker": "NVDA",
        "title": "NVIDIA CORP"
      },
      "has_analysis": true
    }
  ],
  "pagination": {}
}
```

### 3.2 Get Filing by ID

**GET** `/api/filings/:id`

Response: Single filing object with company details and analysis flag

### 3.3 Get Filing by Accession Number

**GET** `/api/filings/accession/:accessionNumber`

Response: Same as 3.2

### 3.4 Get Latest Filings by Type

**GET** `/api/filings/latest/:filing_type`

Query Parameters:

- `limit` (integer, default: 10)

Response: List of latest filings of specified type

### 3.5 Get Company Filings

**GET** `/api/companies/:id/filings`

Query Parameters: Same as 3.1 (excluding `company_id`)

Response: Filings for specific company

### 3.6 Get Company Latest Filing by Type

**GET** `/api/companies/:id/filings/latest/:filing_type`

Response: Single filing object (the latest filing of that type for the company)

### 3.7 Create Filing

**POST** `/api/filings`

Request Body:

```json
{
  "company_id": 1,
  "cik": "0001045810",
  "accession_number": "0001045810-25-000023",
  "filing_type": "10-K",
  "filing_date": "2025-02-26",
  "report_date": "2025-01-26",
  "primary_document": "nvda-20250126.htm",
  "document_url": "https://...",
  "filing_url": "https://...",
  "is_latest_10k": true
}
```

Response: Created filing (201)

### 3.8 Update Filing

**PUT** `/api/filings/:id`

Request Body: Partial filing object

Response: Updated filing (200)

### 3.9 Delete Filing

**DELETE** `/api/filings/:id`

Response: 204 No Content

### 3.10 Get Filing Statistics

**GET** `/api/filings/stats`

Query Parameters:

- `company_id` (integer)
- `ticker` (string)

Response:

```json
{
  "total_filings": 8526,
  "by_type": {
    "6-K": 3989,
    "8-K": 3371,
    "10-Q": 761,
    "10-K": 253,
    "20-F": 140,
    "S-1": 12
  },
  "by_year": {
    "2024": 2341,
    "2025": 4123
  },
  "latest_filing_date": "2025-10-17"
}
```

---

## 4. Analysis Routes

### 4.1 List Analyses

**GET** `/api/analyses`

Query Parameters:

- `page` (integer)
- `limit` (integer)
- `filing_id` (integer)
- `company_id` (integer)
- `ticker` (string)
- `filing_type` (string)
- `model_used` (string)
- `recommendation` (string) - `buy`, `hold`, `sell`, `strong_buy`, `strong_sell`
- `risk_level` (string) - `low`, `medium`, `high`
- `min_confidence` (integer) - Minimum confidence percentage
- `min_score` (float) - Minimum overall score
- `has_guidance` (boolean)
- `from_date` (date) - Analysis completion date range
- `to_date` (date)
- `sort` (string) - `analysis_completed_at`, `overall_score`, `confidence_pct`, `created_at`
- `order` (string) - `asc`, `desc` (default: `desc`)

Response:

```json
{
  "data": [
    {
      "id": 2,
      "filing_id": 8170,
      "model_used": "google/gemini-2.0-flash-001",
      "tokens_used": null,
      "analysis_started_at": "2025-10-19T13:43:51.636Z",
      "analysis_completed_at": "2025-10-19T13:44:04.219Z",
      "created_at": "2025-10-19T13:44:04.219Z",
      "metadata": {
        "ticker": "AXP",
        "company_name": "AMERICAN EXPRESS CO",
        "filing_type": "10-Q",
        "filing_date": "2025-10-17",
        "fiscal_year": "2025",
        "fiscal_quarter": "Q3",
        "period_end_date": "2025-09-30",
        "fiscal_year_end_month": "December",
        "industry_sector": "Financial Services",
        "currency": "USD"
      },
      "investment_signal": {
        "recommendation": "buy",
        "confidence_pct": 70.0,
        "overall_score": null,
        "target_timeframe": "6-12 months",
        "investment_thesis": "American Express delivered strong Q3 results...",
        "valuation_assessment": "fairly_valued",
        "financial_health_score": 85.0,
        "strengths": ["Strong revenue growth", "..."],
        "weaknesses": ["Exposure to macro conditions", "..."],
        "key_catalysts": ["Continued growth", "..."],
        "key_risks": ["Geopolitical uncertainties", "..."]
      },
      "filing": {
        "accession_number": "...",
        "filing_date": "2025-10-17",
        "filing_type": "10-Q"
      },
      "company": {
        "ticker": "AXP",
        "title": "AMERICAN EXPRESS CO"
      }
    }
  ],
  "pagination": {}
}
```

### 4.2 Get Analysis by ID

**GET** `/api/analyses/:id`

Query Parameters:

- `include_full_data` (boolean, default: false) - Include full analysis_data JSON

**Response for 10-K/10-Q Analysis** (Comprehensive Financial Analysis):

```json
{
  "id": 2,
  "filing_id": 8170,
  "model_used": "google/gemini-2.0-flash-001",
  "analysis_data": {
    "metadata": {
      "ticker": "AXP",
      "company_name": "AMERICAN EXPRESS CO",
      "filing_type": "10-Q",
      "fiscal_quarter": "Q3",
      "fiscal_year": "2025",
      "period_end_date": "2025-09-30",
      "industry_sector": "Financial Services",
      "currency": "USD"
    },
    "income_statement": {
      "revenue": 16000.0,
      "cost_of_revenue": null,
      "gross_profit": null,
      "operating_expenses": null,
      "operating_income": 3450.0,
      "net_income": 2510.0
    },
    "balance_sheet": {
      "total_assets": 270000.0,
      "current_assets": null,
      "total_liabilities": null,
      "current_liabilities": null,
      "total_equity": 27000.0,
      "cash_and_equivalents": null
    },
    "cash_flow_statement": {
      "operating_cash_flow": null,
      "investing_cash_flow": null,
      "financing_cash_flow": null,
      "free_cash_flow": null
    },
    "key_metrics": {
      "profitability": {
        "gross_margin_pct": null,
        "operating_margin_pct": 21.5,
        "net_margin_pct": 15.7,
        "return_on_equity_pct": 35.2,
        "return_on_assets_pct": 3.7
      },
      "efficiency": {
        "asset_turnover": null,
        "inventory_turnover": null,
        "receivables_turnover": null
      },
      "liquidity": {
        "current_ratio": null,
        "quick_ratio": null,
        "working_capital": null
      },
      "leverage": {
        "debt_to_equity_ratio": null,
        "debt_to_assets_ratio": null,
        "total_debt": 57787.0
      },
      "per_share": {
        "eps_diluted": 3.49,
        "book_value_per_share": null,
        "revenue_per_share": null
      }
    },
    "segment_data": [
      {
        "segment_name": "U.S. Consumer Services",
        "revenue": 8500.0,
        "profit": 1200.0
      }
    ],
    "geographic_data": [
      {
        "region": "United States",
        "revenue": 12000.0,
        "revenue_pct": 75.0
      }
    ],
    "shareholder_returns": {
      "dividends_paid": 500.0,
      "share_repurchases": 1200.0,
      "dividend_yield_pct": 1.2,
      "payout_ratio_pct": 20.0
    },
    "risk_factors": [
      {
        "category": "Credit Risk",
        "description": "Exposure to credit losses",
        "severity": "medium"
      }
    ],
    "guidance_and_outlook": {
      "has_guidance": true,
      "guidance_period": "2025",
      "revenue_guidance": "10-12% growth",
      "earnings_guidance": "EPS $12-13",
      "management_commentary": "Strong momentum expected..."
    },
    "sentiment_analysis": {
      "overall_tone": "positive",
      "confidence_indicators": ["Record revenues", "Strong margin expansion"],
      "caution_indicators": ["Economic headwinds"]
    },
    "investment_signal": {
      "recommendation": "buy",
      "confidence_pct": 85.0,
      "target_timeframe": "6-12 months",
      "investment_thesis": "Strong fundamentals and growth...",
      "valuation_assessment": "fairly_valued",
      "financial_health_score": 85.0,
      "strengths": ["Strong revenue growth", "Solid margins"],
      "weaknesses": ["Exposure to macro conditions"],
      "key_catalysts": ["Product launches", "Market expansion"],
      "key_risks": ["Competition", "Regulation"]
    }
  }
}
```

**Response for 8-K/6-K Analysis** (Event-Driven Analysis):

```json
{
  "id": 1,
  "filing_id": 8171,
  "model_used": "alibaba/tongyi-deepresearch-30b-a3b:free",
  "analysis_data": {
    "metadata": {
      "ticker": "AXP",
      "company_name": "American Express Company",
      "filing_type": "8-K",
      "fiscal_quarter": "Q3",
      "fiscal_year": "2025",
      "period_end_date": "2025-10-17",
      "industry_sector": "Financial Services",
      "currency": "USD"
    },
    "event_details": {
      "event_type": "Earnings Announcement",
      "item_numbers": ["2.02", "7.01"],
      "event_description": "Q3 2025 earnings results with forward-looking guidance",
      "exhibits_referenced": ["99.1", "99.2"]
    },
    "material_events": {
      "acquisitions": [],
      "divestitures": [],
      "management_changes": [],
      "legal_regulatory": [],
      "other_material_events": ["Q3 earnings release"]
    },
    "financial_snapshot": {
      "revenue": null,
      "net_income": null,
      "eps_diluted": null,
      "revenue_growth_pct": null,
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
      "positive_indicators": [],
      "negative_indicators": ["Economic uncertainty"]
    },
    "investment_signal": {
      "recommendation": "hold",
      "confidence_pct": 50,
      "investment_thesis": "Neutral earnings announcement without specific data...",
      "event_significance": "major",
      "key_catalysts": ["Release of detailed Q3 results"],
      "key_risks": ["Global economic uncertainty", "Regulatory pressures"]
    }
  }
}
```

### 4.3 Get Filing Analysis

**GET** `/api/filings/:id/analysis`

Response: Analysis for specific filing (same structure as 4.2)

### 4.4 Get Company Analyses

**GET** `/api/companies/:id/analyses`

Query Parameters: Similar to 4.1 (excluding `company_id`)

Response: List of analyses for company

### 4.5 Create Analysis

**POST** `/api/analyses`

Request Body:

```json
{
  "filing_id": 8170,
  "model_used": "google/gemini-2.0-flash-001",
  "tokens_used": 15234,
  "analysis_started_at": "2025-10-19T13:43:51.636Z",
  "analysis_data": {}
}
```

Response: Created analysis (201)

### 4.6 Update Analysis

**PUT** `/api/analyses/:id`

Request Body: Partial analysis object

Response: Updated analysis (200)

### 4.7 Delete Analysis

**DELETE** `/api/analyses/:id`

Response: 204 No Content

### 4.8 Get Analysis Investment Signals

**GET** `/api/analyses/signals`

Query Parameters:

- `recommendation` (string)
- `min_confidence` (integer)
- `risk_level` (string)
- `ticker` (string)
- `limit` (integer)

Response: List of analyses with investment_signal data highlighted

### 4.9 Get Analysis Recommendations Summary

**GET** `/api/analyses/recommendations/summary`

Query Parameters:

- `ticker` (string)
- `filing_type` (string)
- `from_date` (date)
- `to_date` (date)

Response:

```json
{
  "total_analyses": 69,
  "by_recommendation": {
    "buy": 25,
    "hold": 30,
    "sell": 14
  },
  "by_risk_level": {
    "low": 20,
    "medium": 35,
    "high": 14
  },
  "average_confidence": 65.5,
  "by_sector": {
    "Financial Services": 15,
    "Technology": 25
  }
}
```

### 4.10 Get Analysis Financial Metrics (10-K/10-Q Only)

**GET** `/api/analyses/:id/metrics`

**Note**: This endpoint only returns data for 10-K/10-Q analyses. Returns 404 for event filings (8-K, 6-K).

Response: Extracted key_metrics data structure

```json
{
  "profitability": {
    "gross_margin_pct": 45.2,
    "operating_margin_pct": 21.5,
    "net_margin_pct": 15.7,
    "return_on_equity_pct": 35.2,
    "return_on_assets_pct": 3.7
  },
  "efficiency": {
    "asset_turnover": 1.2,
    "inventory_turnover": null,
    "receivables_turnover": 8.5
  },
  "liquidity": {
    "current_ratio": 1.5,
    "quick_ratio": 1.2,
    "working_capital": 15000.0
  },
  "leverage": {
    "debt_to_equity_ratio": 2.1,
    "debt_to_assets_ratio": 0.21,
    "total_debt": 57787.0,
    "interest_coverage_ratio": 12.5
  },
  "per_share": {
    "eps_diluted": 3.49,
    "book_value_per_share": 45.2,
    "revenue_per_share": 25.6,
    "cash_per_share": 8.5
  }
}
```

### 4.10b Get Analysis Event Details (8-K/6-K Only)

**GET** `/api/analyses/:id/events`

**Note**: This endpoint only returns data for 8-K/6-K analyses. Returns 404 for periodic filings (10-K, 10-Q).

Response: Extracted event_details and material_events

```json
{
  "event_details": {
    "event_type": "Earnings Announcement",
    "item_numbers": ["2.02", "7.01"],
    "event_description": "Q3 2025 earnings results with forward-looking guidance",
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
  "event_significance": "major"
}
```

### 4.11 Search Analyses by Criteria

**POST** `/api/analyses/search`

Request Body:

```json
{
  "tickers": ["AAPL", "MSFT", "NVDA"],
  "filing_types": ["10-K", "10-Q", "8-K", "6-K"],
  "recommendations": ["buy", "strong_buy"],
  "min_confidence": 70,
  "max_risk_level": "medium",
  "date_range": {
    "from": "2025-01-01",
    "to": "2025-12-31"
  },
  "has_guidance": true,
  "min_revenue_growth": 10.0,
  "sectors": ["Technology", "Financial Services"],
  "event_types": ["Earnings Announcement", "Management Change"],
  "event_significance": ["major"],
  "min_financial_health_score": 70.0,
  "valuation_assessment": ["undervalued", "fairly_valued"]
}
```

**Note**:

- `min_revenue_growth`, `min_financial_health_score`, and `valuation_assessment` only apply to 10-K/10-Q analyses
- `event_types` and `event_significance` only apply to 8-K/6-K analyses

Response: Filtered analyses list

### 4.12 Compare Analyses

**GET** `/api/analyses/compare`

Query Parameters:

- `ids` (comma-separated integers) - Analysis IDs to compare

**Note**: Only analyses of the same type (periodic vs event) can be meaningfully compared.

Response:

```json
{
  "analyses": [
    {
      "id": 1,
      "ticker": "AAPL",
      "filing_type": "10-Q",
      "recommendation": "buy",
      "confidence_pct": 85,
      "key_metrics": {}
    }
  ],
  "comparison": {
    "revenue_growth": [10.5, 12.3, 8.7],
    "net_margin": [25.3, 22.1, 28.9],
    "recommendations": ["buy", "hold", "buy"],
    "financial_health_scores": [85, 78, 92]
  }
}
```

### 4.13 Get Periodic Filing Analyses (10-K/10-Q Only)

**GET** `/api/analyses/periodic`

Query Parameters:

- Same as 4.1, automatically filtered to 10-K, 10-Q, 20-F
- Additional filters: `min_revenue_growth`, `min_net_margin`, `min_financial_health_score`

Response: List of comprehensive financial analyses with full metrics

### 4.14 Get Event Filing Analyses (8-K/6-K Only)

**GET** `/api/analyses/events`

Query Parameters:

- Same as 4.1, automatically filtered to 8-K, 6-K
- Additional filters: `event_type`, `event_significance` (major/minor), `has_material_events`

Response: List of event-driven analyses

### 4.15 Get Material Events Summary

**GET** `/api/analyses/events/material`

Query Parameters:

- `ticker` (string)
- `event_types` (comma-separated) - `acquisition`, `divestiture`, `management_change`, `legal_regulatory`
- `from_date` (date)
- `to_date` (date)
- `limit` (integer)

Response:

```json
{
  "total_events": 15,
  "by_type": {
    "acquisitions": 3,
    "divestitures": 1,
    "management_changes": 5,
    "legal_regulatory": 2,
    "other": 4
  },
  "events": [
    {
      "analysis_id": 1,
      "filing_id": 8171,
      "ticker": "AXP",
      "filing_date": "2025-10-17",
      "event_type": "Earnings Announcement",
      "event_significance": "major",
      "material_events": {
        "management_changes": [
          {
            "name": "John Doe",
            "position": "CFO",
            "change_type": "appointment"
          }
        ]
      }
    }
  ]
}
```

---

## 5. Fetch Log Routes

### 5.1 List Fetch Logs

**GET** `/api/fetch-logs`

Query Parameters:

- `page` (integer)
- `limit` (integer)
- `source` (string) - `sec_filings`, `sec_tickers`, etc.
- `status` (string) - `success`, `failure`, `in_progress`
- `from_date` (date)
- `to_date` (date)
- `sort` (string) - `fetch_started_at`, `fetch_completed_at` (default: `fetch_started_at`)
- `order` (string) - `desc` (default)

Response:

```json
{
  "data": [
    {
      "id": 172,
      "source": "sec_filings",
      "status": "success",
      "records_fetched": 50,
      "records_updated": 8526,
      "records_created": 0,
      "error_message": null,
      "fetch_started_at": "2025-10-19T16:08:36.896Z",
      "fetch_completed_at": "2025-10-19T16:08:40.123Z",
      "duration_seconds": 3.227
    }
  ],
  "pagination": {}
}
```

### 5.2 Get Fetch Log by ID

**GET** `/api/fetch-logs/:id`

Response: Single fetch log object

### 5.3 Create Fetch Log

**POST** `/api/fetch-logs`

Request Body:

```json
{
  "source": "sec_filings",
  "status": "in_progress",
  "fetch_started_at": "2025-10-19T16:08:36.896Z"
}
```

Response: Created fetch log (201)

### 5.4 Update Fetch Log

**PUT** `/api/fetch-logs/:id`

Request Body:

```json
{
  "status": "success",
  "records_fetched": 50,
  "records_updated": 8526,
  "records_created": 0,
  "fetch_completed_at": "2025-10-19T16:08:40.123Z"
}
```

Response: Updated fetch log (200)

### 5.5 Get Fetch Statistics

**GET** `/api/fetch-logs/stats`

Query Parameters:

- `source` (string)
- `from_date` (date)
- `to_date` (date)

Response:

```json
{
  "total_fetches": 172,
  "by_source": {
    "sec_filings": 86,
    "sec_tickers": 86
  },
  "by_status": {
    "success": 170,
    "failure": 2
  },
  "total_records_fetched": 876342,
  "total_records_updated": 734291,
  "total_records_created": 18284,
  "average_duration_seconds": 3.5,
  "last_successful_fetch": {
    "source": "sec_filings",
    "fetch_completed_at": "2025-10-19T16:08:40.123Z"
  }
}
```

---

## 6. Dashboard & Analytics Routes

### 6.1 Get Dashboard Overview

**GET** `/api/dashboard`

Response:

```json
{
  "summary": {
    "total_companies": 7900,
    "total_filings": 8526,
    "total_analyses": 69,
    "analyses_pending": 8457,
    "last_update": "2025-10-19T16:08:40.123Z"
  },
  "recent_analyses": [],
  "top_analyzed_companies": [
    {
      "ticker": "HSBC",
      "company_name": "HSBC HOLDINGS PLC",
      "analysis_count": 26,
      "filing_count": 889
    }
  ],
  "filing_distribution": {
    "6-K": 3989,
    "8-K": 3371,
    "10-Q": 761,
    "10-K": 253
  },
  "recent_filings": []
}
```

### 6.2 Get Market Sentiment

**GET** `/api/analytics/sentiment`

Query Parameters:

- `tickers` (comma-separated)
- `sectors` (comma-separated)
- `from_date` (date)
- `to_date` (date)

Response:

```json
{
  "period": {
    "from": "2025-01-01",
    "to": "2025-10-19"
  },
  "overall_sentiment": {
    "positive": 45,
    "neutral": 30,
    "negative": 25
  },
  "by_sector": {
    "Technology": {
      "positive": 55,
      "neutral": 25,
      "negative": 20
    },
    "Financial Services": {
      "positive": 40,
      "neutral": 35,
      "negative": 25
    }
  },
  "recommendations_trend": {
    "buy": 35,
    "hold": 45,
    "sell": 20
  },
  "average_confidence": 67.5
}
```

### 6.3 Get Filing Timeline

**GET** `/api/analytics/timeline`

Query Parameters:

- `ticker` (string) - Required
- `filing_types` (comma-separated)
- `from_date` (date)
- `to_date` (date)
- `include_analyses` (boolean)

Response:

```json
{
  "ticker": "AAPL",
  "company_name": "Apple Inc.",
  "timeline": [
    {
      "date": "2025-10-17",
      "filing_type": "10-Q",
      "accession_number": "...",
      "report_date": "2025-09-30",
      "has_analysis": true,
      "analysis_summary": {
        "recommendation": "buy",
        "confidence_pct": 85
      }
    }
  ]
}
```

### 6.4 Get Revenue Growth Analysis

**GET** `/api/analytics/revenue-growth`

Query Parameters:

- `tickers` (comma-separated)
- `min_growth` (float)
- `max_growth` (float)
- `limit` (integer)

Response:

```json
{
  "companies": [
    {
      "ticker": "NVDA",
      "company_name": "NVIDIA CORP",
      "latest_analysis": {
        "revenue_growth_pct": 122.4,
        "period": "Q3 2025",
        "revenue": 35000,
        "recommendation": "buy"
      }
    }
  ]
}
```

### 6.5 Get Risk Analysis

**GET** `/api/analytics/risk`

Query Parameters:

- `tickers` (comma-separated)
- `risk_level` (string)
- `limit` (integer)

Response:

```json
{
  "by_risk_level": {
    "low": [
      {
        "ticker": "AAPL",
        "company_name": "Apple Inc.",
        "risk_score": 25,
        "key_risks": ["Market competition", "..."]
      }
    ],
    "medium": [],
    "high": []
  }
}
```

### 6.6 Get Comparative Analysis

**GET** `/api/analytics/compare`

Query Parameters:

- `tickers` (comma-separated, required)
- `metrics` (comma-separated) - `revenue`, `net_income`, `margins`, `growth`, etc.

Response:

```json
{
  "tickers": ["AAPL", "MSFT", "NVDA"],
  "comparison": {
    "revenue": {
      "AAPL": 85000,
      "MSFT": 62000,
      "NVDA": 35000
    },
    "revenue_growth_pct": {
      "AAPL": 8.5,
      "MSFT": 12.3,
      "NVDA": 122.4
    },
    "recommendation": {
      "AAPL": "buy",
      "MSFT": "hold",
      "NVDA": "strong_buy"
    }
  }
}
```

---

## 7. Search & Discovery Routes

### 7.1 Global Search

**GET** `/api/search`

Query Parameters:

- `q` (string, required) - Search query
- `types` (comma-separated) - `companies`, `filings`, `analyses`
- `limit` (integer, default: 20)

Response:

```json
{
  "query": "nvidia",
  "results": {
    "companies": [
      {
        "type": "company",
        "id": 1,
        "ticker": "NVDA",
        "title": "NVIDIA CORP",
        "cik": "0001045810"
      }
    ],
    "filings": [],
    "analyses": []
  },
  "total_results": 45
}
```

### 7.2 Advanced Search

**POST** `/api/search/advanced`

Request Body:

```json
{
  "companies": {
    "tickers": ["AAPL", "MSFT"],
    "sectors": ["Technology"],
    "name_contains": "tech"
  },
  "filings": {
    "types": ["10-K", "10-Q"],
    "date_range": {
      "from": "2025-01-01",
      "to": "2025-12-31"
    }
  },
  "analyses": {
    "recommendations": ["buy"],
    "min_confidence": 70,
    "has_guidance": true
  },
  "limit": 50
}
```

Response: Combined search results

### 7.3 Get Trending Companies

**GET** `/api/trending/companies`

Query Parameters:

- `period` (string) - `day`, `week`, `month`
- `limit` (integer, default: 10)

Response:

```json
{
  "period": "week",
  "companies": [
    {
      "ticker": "HSBC",
      "company_name": "HSBC HOLDINGS PLC",
      "recent_filings_count": 15,
      "recent_analyses_count": 5,
      "latest_recommendation": "buy"
    }
  ]
}
```

### 7.4 Get Hot Filings

**GET** `/api/trending/filings`

Query Parameters:

- `days` (integer, default: 7)
- `filing_types` (comma-separated)
- `limit` (integer)

Response: Recent filings with analysis status

---

## 8. Webhook & Event Routes

### 8.1 Register Webhook

**POST** `/api/webhooks`

Request Body:

```json
{
  "url": "https://example.com/webhook",
  "events": ["analysis.created", "filing.created"],
  "filters": {
    "tickers": ["AAPL", "MSFT"],
    "filing_types": ["10-K", "10-Q"]
  }
}
```

Response: Created webhook (201)

### 8.2 List Webhooks

**GET** `/api/webhooks`

Response: List of registered webhooks

### 8.3 Delete Webhook

**DELETE** `/api/webhooks/:id`

Response: 204 No Content

---

## 9. Batch Operations Routes

### 9.1 Batch Create Filings

**POST** `/api/batch/filings`

Request Body:

```json
{
  "filings": [{}, {}]
}
```

Response: Batch operation result

### 9.2 Trigger Analysis for Filings

**POST** `/api/batch/analyze`

Request Body:

```json
{
  "filing_ids": [1, 2, 3],
  "model": "google/gemini-2.0-flash-001",
  "priority": "high"
}
```

Response: Job ID and status

### 9.3 Get Batch Job Status

**GET** `/api/batch/jobs/:job_id`

Response:

```json
{
  "job_id": "abc-123",
  "status": "in_progress",
  "total": 10,
  "completed": 7,
  "failed": 0,
  "created_at": "2025-10-19T16:00:00Z",
  "updated_at": "2025-10-19T16:05:00Z"
}
```

---

## 10. Export Routes

### 10.1 Export Analyses

**GET** `/api/export/analyses`

Query Parameters:

- `format` (string) - `json`, `csv`, `excel`
- `ticker` (string)
- `filing_types` (comma-separated)
- `from_date` (date)
- `to_date` (date)
- `fields` (comma-separated) - Specific fields to export

Response: File download

### 10.2 Export Filings

**GET** `/api/export/filings`

Query Parameters: Similar to 10.1

Response: File download

### 10.3 Export Company Report

**GET** `/api/export/companies/:id/report`

Query Parameters:

- `format` (string) - `pdf`, `excel`, `json`
- `include_filings` (boolean)
- `include_analyses` (boolean)

Response: Comprehensive company report file

---

## 11. Health & Utility Routes

### 11.1 Health Check

**GET** `/api/health`

Response:

```json
{
  "status": "healthy",
  "timestamp": "2025-10-19T16:08:40Z",
  "database": "connected",
  "version": "1.0.0"
}
```

### 11.2 Get API Info

**GET** `/api/info`

Response:

```json
{
  "version": "1.0.0",
  "database_stats": {
    "companies": 7900,
    "filings": 8526,
    "analyses": 69
  },
  "supported_filing_types": ["10-K", "10-Q", "8-K", "6-K", "20-F", "S-1"],
  "supported_models": ["google/gemini-2.0-flash-001", "..."]
}
```

### 11.3 Get Database Statistics

**GET** `/api/stats`

Response: Comprehensive database statistics

---

## Response Codes

- **200** - OK
- **201** - Created
- **204** - No Content
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **409** - Conflict (duplicate resource)
- **422** - Unprocessable Entity (validation error)
- **429** - Too Many Requests
- **500** - Internal Server Error
- **503** - Service Unavailable

---

## Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "ticker",
        "message": "Ticker is required"
      }
    ]
  }
}
```

---

## Pagination

All list endpoints support pagination with the following response format:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 7900,
    "totalPages": 158,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Rate Limiting

- **Standard**: 100 requests/minute
- **Batch operations**: 10 requests/minute
- **Exports**: 5 requests/minute

Rate limit headers:

- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

---

## Authentication (Future)

All routes should support authentication via:

- **API Key**: `X-API-Key` header
- **JWT**: `Authorization: Bearer <token>`

---

## 12. User Routes

### 12.1 List Users

**GET** `/api/users`

Query Parameters:

- `page` (integer, default: 1)
- `limit` (integer, default: 50, max: 100)
- `search` (string) - Search by email or username

Response:

```json
{
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "username": "trader123",
      "created_at": "2025-10-19T11:53:53.569Z",
      "updated_at": "2025-10-19T11:53:53.569Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 12.2 Get User by ID

**GET** `/api/users/:id`

Response:

```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "trader123",
  "created_at": "2025-10-19T11:53:53.569Z",
  "updated_at": "2025-10-19T11:53:53.569Z"
}
```

### 12.3 Get User by Email

**GET** `/api/users/email/:email`

Response: Same as 12.2

### 12.4 Create User

**POST** `/api/users`

Request Body:

```json
{
  "email": "newuser@example.com",
  "username": "newtrader",
  "password_hash": "hashed_password_string"
}
```

Validation:

- Email must be valid format
- Username must be 3-100 characters
- Email and username must be unique

Response: Created user object (201)

### 12.5 Update User

**PUT** `/api/users/:id`

Request Body:

```json
{
  "email": "updated@example.com",
  "username": "updatedusername",
  "password_hash": "new_hashed_password"
}
```

Response: Updated user object (200)

### 12.6 Delete User

**DELETE** `/api/users/:id`

Response: 204 No Content

**Note**: This will cascade delete all user favorites

### 12.7 Get User Favorites

**GET** `/api/users/:id/favorites`

Query Parameters:

- `page` (integer, default: 1)
- `limit` (integer, default: 50)

Response:

```json
{
  "data": [
    {
      "id": 1,
      "cik": "0001045810",
      "ticker": "NVDA",
      "title": "NVIDIA CORP",
      "created_at": "2025-10-19T11:53:53.569Z",
      "updated_at": "2025-10-19T11:53:53.569Z",
      "favorited_at": "2025-10-20T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 12,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### 12.8 Add Stock to Favorites

**POST** `/api/users/:id/favorites`

Request Body:

```json
{
  "company_id": 1
}
```

Response: Created favorite (201)

```json
{
  "id": 1,
  "user_id": 1,
  "company_id": 1,
  "created_at": "2025-10-20T10:30:00.000Z"
}
```

### 12.9 Remove Stock from Favorites

**DELETE** `/api/users/:id/favorites/:companyId`

Response: 204 No Content

### 12.10 Check if Stock is Favorited

**GET** `/api/users/:id/favorites/:companyId`

Response:

```json
{
  "is_favorite": true
}
```

---

## Database Schema Summary

### Companies

- `id`, `cik`, `ticker`, `title`, `created_at`, `updated_at`

### Ticker Aliases

- `id`, `company_id`, `ticker`, `is_primary`, `created_at`

### Filings

- `id`, `company_id`, `cik`, `accession_number`, `filing_type`, `filing_date`, `report_date`
- `primary_document`, `document_url`, `filing_url`
- `is_latest_10k`, `is_latest_10q`, `is_latest_8k`, `is_latest_6k`, `is_latest_20f`, `is_latest_s1`
- `created_at`, `updated_at`

### Analyses

- `id`, `filing_id`, `analysis_data` (JSONB), `model_used`, `tokens_used`
- `analysis_started_at`, `analysis_completed_at`, `created_at`

**Analysis Data Structure:**

- `metadata`, `financial_snapshot`, `income_statement`, `balance_sheet`, `cash_flow_statement`
- `key_metrics` (profitability, efficiency, liquidity, leverage, per_share)
- `segment_data`, `geographic_data`, `shareholder_returns`
- `guidance_and_outlook`, `material_events`, `risk_factors`
- `sentiment_analysis`, `investment_signal`, `event_details`

### Fetch Logs

- `id`, `source`, `status`, `records_fetched`, `records_updated`, `records_created`
- `error_message`, `fetch_started_at`, `fetch_completed_at`

### Users

- `id`, `email`, `username`, `password_hash`, `created_at`, `updated_at`

### User Favorites

- `id`, `user_id`, `company_id`, `created_at`
- Foreign keys: `user_id` → `users.id`, `company_id` → `companies.id`
- Unique constraint on (`user_id`, `company_id`)

---

## Implementation Priority

### Phase 1 - Core CRUD (Essential)

1. Company Routes (1.1-1.4, 1.6)
2. Filing Routes (3.1-3.6)
3. Analysis Routes (4.1-4.4)
4. Ticker Alias Routes (2.1-2.2)

### Phase 2 - Analytics & Search

5. Dashboard Routes (6.1)
6. Search Routes (7.1)
7. Analysis Signals (4.8-4.9)
8. Filing Statistics (3.10)

### Phase 3 - Advanced Features

9. Analytics Routes (6.2-6.6)
10. Advanced Search (7.2-7.4)
11. Fetch Log Routes (5.1-5.5)
12. Batch Operations (9.1-9.3)

### Phase 4 - Export & Integration

13. Export Routes (10.1-10.3)
14. Webhook Routes (8.1-8.3)
15. Health & Utility (11.1-11.3)
