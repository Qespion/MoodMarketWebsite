# Dashboard API Route Specification

## GET /api/dashboard

Returns aggregated statistics for the dashboard overview.

### Response Format

```json
{
  "companies": {
    "total": 7900,
    "with_recent_filings": 1250
  },
  "filings": {
    "total": 8526,
    "by_type": {
      "10-K": 253,
      "10-Q": 761,
      "8-K": 3371,
      "6-K": 3989,
      "20-F": 140,
      "S-1": 12
    },
    "last_24h": 45
  },
  "analyses": {
    "total": 69,
    "by_recommendation": {
      "buy": 25,
      "hold": 30,
      "sell": 14
    }
  }
}
```

### Field Descriptions

#### Companies Tracked
- `total`: Total number of companies in the database
- `with_recent_filings`: Number of companies with at least one filing in the last 30 days

#### filings
- `total`: Total number of filings in the database
- `by_type`: Object mapping filing types to their counts
- `last_24h`: Number of filings created in the last 24 hours

#### AI Analyses
- `total`: Total number of analyses in the database
- `by_recommendation`: Object mapping investment recommendations to their counts (from `analysis_data.investment_signal.recommendation`)

### Database Queries

#### Total Companies
```sql
SELECT COUNT(*) as total FROM companies;
```

#### Companies with Recent Filings
```sql
SELECT COUNT(DISTINCT c.id) as with_recent_filings
FROM companies c
JOIN filings f ON c.id = f.company_id
WHERE f.filing_date >= DATE_SUB(NOW(), INTERVAL 30 DAY);
```

#### Total Filings
```sql
SELECT COUNT(*) as total FROM filings;
```

#### Filings by Type
```sql
SELECT filing_type, COUNT(*) as count
FROM filings
GROUP BY filing_type;
```

#### Filings in Last 24 Hours
```sql
SELECT COUNT(*) as last_24h
FROM filings
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR);
```

#### Total Analyses
```sql
SELECT COUNT(*) as total FROM analyses;
```

#### Analyses by Recommendation
```sql
SELECT
  JSON_EXTRACT(analysis_data, '$.investment_signal.recommendation') as recommendation,
  COUNT(*) as count
FROM analyses
WHERE JSON_EXTRACT(analysis_data, '$.investment_signal.recommendation') IS NOT NULL
GROUP BY JSON_EXTRACT(analysis_data, '$.investment_signal.recommendation');
```

### Response Codes
- `200`: Success
- `500`: Internal server error

### Performance Considerations
- Cache this endpoint for 5-10 minutes since stats don't change frequently
- Use database indexes on `filings.filing_date`, `filings.created_at`, and `analyses` table for JSON queries
- Consider pre-computing some stats in a separate table for faster queries</content>
<parameter name="filePath">dashboard-api-specs.md