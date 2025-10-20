# MoodMarket API Specifications

**Base URL**: `http://iw0g4808sw8ks4oco0k4gwsg.158.69.200.14.sslip.io/api`

## Table of Contents

1. [Health Check](#health-check)
2. [Companies](#companies)
3. [Filings](#filings)
4. [Analyses](#analyses)
5. [Ticker Aliases](#ticker-aliases)
6. [Fetch Logs](#fetch-logs)
7. [Dashboard](#dashboard)
8. [Search](#search)
9. [Trending](#trending)

---

## Health Check

### GET `/health`

Returns API health status.

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-10-19T17:00:00.000Z",
  "database": "connected"
}
```

---

## Companies

### GET `/companies`

List all companies with pagination and filtering.

**Query Parameters**:
- `page` (number, default: 1) - Page number
- `limit` (number, default: 50, max: 100) - Results per page
- `search` (string) - Search by ticker or company title

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "cik": "0001045810",
      "ticker": "NVDA",
      "title": "NVIDIA CORP",
      "created_at": "2025-10-19T00:00:00.000Z",
      "updated_at": "2025-10-19T00:00:00.000Z",
      "filings_count": 45,
      "analyses_count": 12
    }
  ],
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

### GET `/companies/:id`

Get a specific company by ID with statistics.

**Response**:
```json
{
  "id": 1,
  "cik": "0001045810",
  "ticker": "NVDA",
  "title": "NVIDIA CORP",
  "created_at": "2025-10-19T00:00:00.000Z",
  "updated_at": "2025-10-19T00:00:00.000Z",
  "stats": {
    "filings_count": 45,
    "analyses_count": 12,
    "latest_filing_date": "2025-09-15T00:00:00.000Z"
  }
}
```

### GET `/companies/ticker/:ticker`

Get a company by ticker symbol.

**Example**: `/companies/ticker/NVDA`

### GET `/companies/cik/:cik`

Get a company by CIK number.

**Example**: `/companies/cik/0001045810`

### GET `/companies/:id/aliases`

Get all ticker aliases for a company.

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "company_id": 1,
      "ticker": "NVDA",
      "is_primary": true,
      "created_at": "2025-10-19T00:00:00.000Z"
    }
  ]
}
```

### POST `/companies`

Create a new company.

**Request Body**:
```json
{
  "cik": "0001045810",
  "ticker": "NVDA",
  "title": "NVIDIA CORP"
}
```

### PUT `/companies/:id`

Update a company.

**Request Body**:
```json
{
  "ticker": "NVDA",
  "title": "NVIDIA CORPORATION"
}
```

### DELETE `/companies/:id`

Delete a company.

**Response**: `204 No Content`

---

## Filings

### GET `/filings`

List all filings with filtering and pagination.

**Query Parameters**:
- `page` (number, default: 1) - Page number
- `limit` (number, default: 50, max: 100) - Results per page
- `company_id` (number) - Filter by company ID
- `ticker` (string) - Filter by ticker symbol
- `filing_type` (string) - Filter by filing type (10-K, 10-Q, 8-K, etc.)
- `from_date` (date) - Filter filings from this date
- `to_date` (date) - Filter filings to this date
- `is_latest_10k` (boolean) - Filter latest 10-K filings
- `is_latest_10q` (boolean) - Filter latest 10-Q filings
- `has_analysis` (boolean) - Filter filings with analyses
- `sort` (string) - Sort field (filing_date, created_at)
- `order` (string) - Sort order (ASC, DESC)

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "company_id": 1,
      "cik": "0001045810",
      "accession_number": "0001045810-25-000001",
      "filing_type": "10-K",
      "filing_date": "2025-09-15T00:00:00.000Z",
      "report_date": "2025-07-31T00:00:00.000Z",
      "primary_document": "nvda-20250731.htm",
      "document_url": "https://www.sec.gov/...",
      "filing_url": "https://www.sec.gov/...",
      "is_latest_10k": true,
      "created_at": "2025-10-19T00:00:00.000Z",
      "ticker": "NVDA",
      "company_title": "NVIDIA CORP",
      "has_analysis": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 45000,
    "totalPages": 900,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### GET `/filings/:id`

Get a specific filing by ID.

### GET `/filings/accession/:accessionNumber`

Get a filing by accession number.

**Example**: `/filings/accession/0001045810-25-000001`

### GET `/filings/latest/:filing_type`

Get latest filings by type.

**Query Parameters**:
- `limit` (number, default: 10) - Number of results

**Example**: `/filings/latest/10-K?limit=5`

### GET `/filings/stats`

Get filing statistics.

**Query Parameters**:
- `company_id` (number) - Filter by company
- `ticker` (string) - Filter by ticker

**Response**:
```json
{
  "total_filings": 45000,
  "by_type": {
    "10-K": 7900,
    "10-Q": 23700,
    "8-K": 13400
  },
  "filings_with_analysis": 102,
  "latest_filing_date": "2025-09-15T00:00:00.000Z"
}
```

### POST `/filings`

Create a new filing.

**Request Body**:
```json
{
  "company_id": 1,
  "cik": "0001045810",
  "accession_number": "0001045810-25-000001",
  "filing_type": "10-K",
  "filing_date": "2025-09-15",
  "report_date": "2025-07-31",
  "primary_document": "nvda-20250731.htm",
  "document_url": "https://www.sec.gov/...",
  "filing_url": "https://www.sec.gov/..."
}
```

### PUT `/filings/:id`

Update a filing.

### DELETE `/filings/:id`

Delete a filing.

---

## Analyses

### GET `/analyses`

List all analyses with filtering and pagination.

**Query Parameters**:
- `page` (number, default: 1) - Page number
- `limit` (number, default: 50, max: 100) - Results per page
- `filing_id` (number) - Filter by filing ID
- `company_id` (number) - Filter by company ID
- `ticker` (string) - Filter by ticker symbol
- `filing_type` (string) - Filter by filing type
- `model_used` (string) - Filter by AI model
- `recommendation` (string) - Filter by recommendation (buy, hold, sell, strong_buy, strong_sell)
- `risk_level` (string) - Filter by risk level
- `min_confidence` (number) - Minimum confidence percentage
- `min_score` (number) - Minimum overall score
- `has_guidance` (boolean) - Filter analyses with guidance
- `from_date` (date) - Filter from this date
- `to_date` (date) - Filter to this date
- `sort` (string) - Sort field (analysis_completed_at, overall_score, confidence_pct)
- `order` (string) - Sort order (ASC, DESC)

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "filing_id": 1,
      "model_used": "alibaba/tongyi-deepresearch-30b-a3b:free",
      "tokens_used": null,
      "analysis_started_at": "2025-10-19T17:00:00.000Z",
      "analysis_completed_at": "2025-10-19T17:00:05.000Z",
      "created_at": "2025-10-19T17:00:05.000Z",
      "metadata": {
        "ticker": "NVDA",
        "filing_type": "10-K",
        "fiscal_year": "2025"
      },
      "investment_signal": {
        "recommendation": "buy",
        "confidence_pct": 85,
        "overall_score": 8.5
      },
      "filing": {
        "accession_number": "0001045810-25-000001",
        "filing_date": "2025-09-15T00:00:00.000Z",
        "filing_type": "10-K"
      },
      "company": {
        "ticker": "NVDA",
        "title": "NVIDIA CORP"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 102,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### GET `/analyses/latest`

Get latest analyses with cursor-based pagination (optimized for infinite scroll).

**Query Parameters**:
- `limit` (number, default: 20, max: 100) - Results per page
- `cursor` (string) - Cursor for pagination (analysis ID)

**Response**:
```json
{
  "data": [
    {
      "id": 102,
      "filing_id": 493,
      "model_used": "alibaba/tongyi-deepresearch-30b-a3b:free",
      "tokens_used": null,
      "analysis_started_at": "2025-10-19T17:17:29.329Z",
      "analysis_completed_at": "2025-10-19T17:17:35.475Z",
      "created_at": "2025-10-19T17:17:35.475Z",
      "analysis_data": {
        "metadata": { ... },
        "investment_signal": { ... },
        "financial_snapshot": { ... },
        "sentiment_analysis": { ... },
        "guidance_and_outlook": { ... }
      },
      "accession_number": "0001193125-25-200108",
      "filing_date": "2025-09-10T00:00:00.000Z",
      "filing_type": "8-K",
      "company_id": 7,
      "ticker": "AVGO",
      "company_title": "Broadcom Inc.",
      "cik": "0001730168"
    }
  ],
  "cursor": {
    "next": "101",
    "hasMore": true
  },
  "meta": {
    "count": 2,
    "limit": 20
  }
}
```

### GET `/analyses/:id`

Get a specific analysis by ID.

**Query Parameters**:
- `include_full_data` (boolean, default: false) - Include complete analysis_data

**Response**:
```json
{
  "id": 1,
  "filing_id": 1,
  "model_used": "alibaba/tongyi-deepresearch-30b-a3b:free",
  "tokens_used": null,
  "analysis_started_at": "2025-10-19T17:00:00.000Z",
  "analysis_completed_at": "2025-10-19T17:00:05.000Z",
  "created_at": "2025-10-19T17:00:05.000Z",
  "analysis_data": { ... },
  "filing": {
    "accession_number": "0001045810-25-000001",
    "filing_date": "2025-09-15T00:00:00.000Z",
    "filing_type": "10-K"
  },
  "company": {
    "ticker": "NVDA",
    "title": "NVIDIA CORP"
  }
}
```

### GET `/analyses/:id/metrics`

Get financial metrics from an analysis (10-K/10-Q/20-F only).

**Response**:
```json
{
  "revenue": 26900000000,
  "revenue_growth_pct": 122.4,
  "net_income": 14880000000,
  "net_income_growth_pct": 168.0,
  "eps_diluted": 0.60,
  "eps_growth_pct": 152.0,
  "gross_margin_pct": 75.1,
  "operating_margin_pct": 62.1
}
```

### GET `/analyses/:id/events`

Get event details from an analysis (8-K/6-K only).

**Response**:
```json
{
  "event_details": {
    "event_type": "Strategic Acquisition Completion",
    "event_description": "...",
    "item_numbers": ["8.01", "9.01"]
  },
  "material_events": {
    "acquisitions": [...],
    "management_changes": [...]
  },
  "event_significance": "major"
}
```

### GET `/analyses/recommendations/summary`

Get recommendations summary statistics.

**Query Parameters**:
- `ticker` (string) - Filter by ticker
- `filing_type` (string) - Filter by filing type
- `from_date` (date) - Filter from this date
- `to_date` (date) - Filter to this date

**Response**:
```json
{
  "total_analyses": 102,
  "by_recommendation": {
    "strong_buy": 12,
    "buy": 45,
    "hold": 30,
    "sell": 10,
    "strong_sell": 5
  },
  "average_confidence": 72.5
}
```

### POST `/analyses`

Create a new analysis.

**Request Body**:
```json
{
  "filing_id": 1,
  "model_used": "alibaba/tongyi-deepresearch-30b-a3b:free",
  "tokens_used": 5000,
  "analysis_started_at": "2025-10-19T17:00:00.000Z",
  "analysis_data": { ... }
}
```

### PUT `/analyses/:id`

Update an analysis.

### DELETE `/analyses/:id`

Delete an analysis.

---

## Ticker Aliases

### GET `/ticker-aliases`

List all ticker aliases with pagination.

**Query Parameters**:
- `page` (number, default: 1) - Page number
- `limit` (number, default: 50) - Results per page
- `company_id` (number) - Filter by company ID
- `is_primary` (boolean) - Filter primary aliases

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "company_id": 1,
      "ticker": "NVDA",
      "is_primary": true,
      "created_at": "2025-10-19T00:00:00.000Z"
    }
  ],
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

### POST `/ticker-aliases`

Create a new ticker alias.

**Request Body**:
```json
{
  "company_id": 1,
  "ticker": "NVDA",
  "is_primary": true
}
```

### PUT `/ticker-aliases/:id`

Update a ticker alias.

### DELETE `/ticker-aliases/:id`

Delete a ticker alias.

---

## Fetch Logs

### GET `/fetch-logs`

List all fetch logs with pagination.

**Query Parameters**:
- `page` (number, default: 1) - Page number
- `limit` (number, default: 50) - Results per page
- `source` (string) - Filter by source (sec_rss, manual, scheduled)
- `status` (string) - Filter by status (success, failed, in_progress)
- `sort` (string) - Sort field (fetch_started_at, duration)
- `order` (string) - Sort order (ASC, DESC)

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "source": "sec_rss",
      "status": "success",
      "records_fetched": 100,
      "records_updated": 10,
      "records_created": 90,
      "error_message": null,
      "fetch_started_at": "2025-10-19T17:00:00.000Z",
      "fetch_completed_at": "2025-10-19T17:05:00.000Z",
      "duration": 300
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 50,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### GET `/fetch-logs/:id`

Get a specific fetch log by ID.

### GET `/fetch-logs/stats`

Get fetch log statistics.

**Response**:
```json
{
  "total_fetches": 50,
  "successful": 45,
  "failed": 5,
  "by_source": {
    "sec_rss": 30,
    "manual": 15,
    "scheduled": 5
  },
  "average_duration": 250
}
```

### POST `/fetch-logs`

Create a new fetch log.

**Request Body**:
```json
{
  "source": "sec_rss",
  "status": "in_progress",
  "fetch_started_at": "2025-10-19T17:00:00.000Z"
}
```

### PUT `/fetch-logs/:id`

Update a fetch log.

**Request Body**:
```json
{
  "status": "success",
  "records_fetched": 100,
  "records_created": 90,
  "records_updated": 10,
  "fetch_completed_at": "2025-10-19T17:05:00.000Z"
}
```

---

## Dashboard

### GET `/dashboard`

Get dashboard overview with key statistics.

**Response**:
```json
{
  "companies": {
    "total": 7900,
    "with_recent_filings": 1200
  },
  "filings": {
    "total": 45000,
    "by_type": {
      "10-K": 7900,
      "10-Q": 23700,
      "8-K": 13400
    },
    "last_24h": 150,
    "last_7d": 800
  },
  "analyses": {
    "total": 102,
    "last_24h": 5,
    "last_7d": 35,
    "by_recommendation": {
      "strong_buy": 12,
      "buy": 45,
      "hold": 30,
      "sell": 10,
      "strong_sell": 5
    }
  },
  "fetch_logs": {
    "total": 50,
    "successful": 45,
    "failed": 5,
    "last_fetch": "2025-10-19T17:00:00.000Z"
  }
}
```

---

## Search

### GET `/search`

Global search across companies, filings, and analyses.

**Query Parameters**:
- `q` (string, required) - Search query
- `type` (string) - Filter by type (companies, filings, analyses, all)
- `limit` (number, default: 10) - Results per type

**Response**:
```json
{
  "query": "NVIDIA",
  "results": {
    "companies": [
      {
        "id": 1,
        "ticker": "NVDA",
        "title": "NVIDIA CORP",
        "cik": "0001045810"
      }
    ],
    "filings": [
      {
        "id": 1,
        "accession_number": "0001045810-25-000001",
        "filing_type": "10-K",
        "filing_date": "2025-09-15T00:00:00.000Z",
        "ticker": "NVDA"
      }
    ],
    "analyses": [
      {
        "id": 1,
        "ticker": "NVDA",
        "filing_type": "10-K",
        "recommendation": "buy",
        "confidence_pct": 85
      }
    ]
  },
  "counts": {
    "companies": 1,
    "filings": 45,
    "analyses": 12
  }
}
```

### POST `/search/advanced`

Advanced search with detailed filters.

**Request Body**:
```json
{
  "query": "NVIDIA",
  "filters": {
    "companies": {
      "ticker": "NVDA"
    },
    "filings": {
      "filing_type": "10-K",
      "from_date": "2024-01-01",
      "to_date": "2025-12-31"
    },
    "analyses": {
      "recommendation": "buy",
      "min_confidence": 80
    }
  },
  "limit": 20
}
```

---

## Trending

### GET `/trending/companies`

Get trending companies based on recent filing activity.

**Query Parameters**:
- `period` (string, default: week) - Time period (day, week, month)
- `limit` (number, default: 10) - Number of results

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "ticker": "NVDA",
      "title": "NVIDIA CORP",
      "filings_count": 5,
      "analyses_count": 3,
      "latest_filing_date": "2025-09-15T00:00:00.000Z"
    }
  ],
  "period": "week",
  "generated_at": "2025-10-19T17:00:00.000Z"
}
```

### GET `/trending/filings`

Get hot/recent filings.

**Query Parameters**:
- `days` (number, default: 7) - Days to look back
- `filing_type` (string) - Filter by filing type
- `limit` (number, default: 10) - Number of results

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "ticker": "NVDA",
      "company_title": "NVIDIA CORP",
      "filing_type": "10-K",
      "filing_date": "2025-09-15T00:00:00.000Z",
      "accession_number": "0001045810-25-000001",
      "has_analysis": true
    }
  ],
  "days": 7,
  "generated_at": "2025-10-19T17:00:00.000Z"
}
```

---

## Common Response Codes

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `204 No Content` - Successful deletion
- `400 Bad Request` - Invalid request parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Error Response Format

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "status": 400
  }
}
```

## Common Error Codes

- `VALIDATION_ERROR` - Invalid input data
- `NOT_FOUND_ERROR` - Resource not found
- `DATABASE_ERROR` - Database operation failed
- `INTERNAL_ERROR` - Internal server error

## Pagination

All list endpoints support pagination with two formats:

### Offset-based Pagination (Default)
- Parameters: `page`, `limit`
- Used by most endpoints
- Returns `pagination` object with total counts

### Cursor-based Pagination
- Parameters: `cursor`, `limit`
- Used by `/analyses/latest`
- Returns `cursor` object with `next` cursor and `hasMore` flag
- Optimized for infinite scroll and large datasets

## Filtering

Most list endpoints support filtering through query parameters. Filters are case-sensitive unless specified otherwise.

## Sorting

Endpoints that support sorting accept:
- `sort` - Field name to sort by
- `order` - `ASC` or `DESC` (default varies by endpoint)
