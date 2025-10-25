# API Route Issues - Missing Company Statistics

## Problem Description

The dashboard companies page and individual company detail pages are displaying `0` for Total Filings, AI Analyses, and related statistics because the API routes are not returning the required count fields in the expected format.

## Current Issues

### 1. Companies List Endpoint (`/api/companies`)

**Current Response (from API specs):**
```json
{
  "data": [
    {
      "id": 1,
      "cik": "0001045810", 
      "ticker": "NVDA",
      "title": "NVIDIA CORP",
      "created_at": "2025-10-19T00:00:00.000Z",
      "updated_at": "2025-10-19T00:00:00.000Z"
    }
  ]
}
```

**Expected Response (what frontend needs):**
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
  ]
}
```

**Missing Fields:**
- `filings_count`: Total number of SEC filings for this company
- `analyses_count`: Total number of AI analyses for this company

### 2. Company Detail Endpoint (`/api/companies/ticker/:ticker` or `/api/companies/:id`)

**Current Response (from API specs):**
```json
{
  "id": 1,
  "cik": "0001045810",
  "ticker": "NVDA",
  "title": "NVIDIA CORP", 
  "created_at": "2025-10-19T11:53:53.569Z",
  "updated_at": "2025-10-19T11:53:53.569Z",
  "aliases": [...],
  "stats": {
    "total_filings": 45,
    "total_analyses": 3,
    "latest_filing_date": "2025-10-17"
  }
}
```

**Expected Response (what frontend needs):**
```json
{
  "id": 1,
  "cik": "0001045810", 
  "ticker": "NVDA",
  "title": "NVIDIA CORP",
  "created_at": "2025-10-19T11:53:53.569Z",
  "updated_at": "2025-10-19T11:53:53.569Z",
  "filings_count": 45,
  "analyses_count": 3
}
```

**Issues:**
- Frontend expects `filings_count` and `analyses_count` directly on the company object
- API currently returns these under `stats.total_filings` and `stats.total_analyses`
- The `stats` object structure is not being used by the frontend

## Required Database Queries

### For Companies List
The `/api/companies` endpoint needs to be modified to include count aggregations:

```sql
SELECT 
  c.id,
  c.cik,
  c.ticker,
  c.title,
  c.created_at,
  c.updated_at,
  COUNT(f.id) as filings_count,
  COUNT(a.id) as analyses_count
FROM companies c
LEFT JOIN filings f ON c.id = f.company_id
LEFT JOIN analyses a ON f.id = a.filing_id
GROUP BY c.id, c.cik, c.ticker, c.title, c.created_at, c.updated_at
```

### For Company Detail
The `/api/companies/:id` and `/api/companies/ticker/:ticker` endpoints need to return counts directly on the company object:

```sql
SELECT 
  c.id,
  c.cik,
  c.ticker,
  c.title,
  c.created_at,
  c.updated_at,
  COUNT(DISTINCT f.id) as filings_count,
  COUNT(DISTINCT a.id) as analyses_count
FROM companies c
LEFT JOIN filings f ON c.id = f.company_id
LEFT JOIN analyses a ON f.id = a.filing_id
WHERE c.id = ? OR c.ticker = ?
GROUP BY c.id, c.cik, c.ticker, c.title, c.created_at, c.updated_at
```

## Frontend Type Definitions

The current `Company` type in `types/api.ts` correctly expects these fields:

```typescript
export interface Company {
  id: number;
  cik: string;
  ticker: string;
  title: string;
  created_at: string;
  updated_at: string;
  filings_count?: number;  // ✅ Correctly defined
  analyses_count?: number; // ✅ Correctly defined
}
```

## Implementation Priority

1. **High Priority**: Fix `/api/companies` endpoint to include counts in list view
2. **High Priority**: Fix `/api/companies/:id` and `/api/companies/ticker/:ticker` to return counts directly on company object instead of under `stats`
3. **Low Priority**: Remove unused `stats` object from company detail responses if not needed elsewhere

## Testing

After implementing the fixes:

1. Companies list page should show actual filing and analysis counts instead of 0
2. Individual company pages should display correct Total Filings and AI Analyses numbers
3. Verify counts match actual database records
4. Ensure pagination and filtering still work correctly

## Alternative Solutions

If modifying the API is not feasible, the frontend could be updated to:

1. Access counts from `company.stats.total_filings` and `company.stats.total_analyses` 
2. Or make separate API calls to get counts for each company

However, the recommended approach is to fix the API to match the expected frontend interface for better performance and consistency.</content>
<parameter name="filePath">API_MISSING_COUNTS.md