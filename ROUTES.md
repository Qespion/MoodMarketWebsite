# Latest API Changes (summary)

This file lists the most recent API changes that were implemented, the exact endpoints added, supported query parameters, and the files changed in the codebase. Use this as a concise changelog for frontend and backend reference.

Date: 2025-10-21

Summary

- Added "follows" endpoints (aliasing user favorites) to expose filings and analyses for companies a user follows.

New Endpoints

1. GET /api/users/:id/follows/filings

- Purpose: Return filings for companies the user follows.
- Query params:
  - `page` — page number (string)
  - `limit` — page size (string)
  - `filing_type` — filter by filing type (string)
  - `from_date` — ISO date; `filing_date >= from_date`
  - `to_date` — ISO date; `filing_date <= to_date`
  - `has_analysis` — `true` or `false`; filter by presence of an analysis for the filing
- Response: paginated list of filings. Each item includes filing fields and `company: { ticker, title }`.

2. GET /api/users/:id/follows/analyses

- Purpose: Return analyses for companies the user follows.
- Query params (supports most analyses filters):
  - `page`, `limit`
  - `filing_id` — numeric
  - `ticker` — company ticker (case-insensitive)
  - `filing_type`
  - `recommendation` — CSV (e.g. `BUY,SELL`)
  - `min_confidence` or `confidence_min` — numeric; filters on `investment_signal.confidence_pct`
  - `financial_health_min` — numeric
  - `from_date` / `to_date` — filters on `analysis_completed_at`
  - `filing_from_date` / `filing_to_date` — filters on filing's `filing_date`
- Response: paginated list of analyses. Each item includes analysis fields, `investment_signal`, `metadata`, `filing` and `company` objects.

Files changed

- src/services/userService.ts
  - Added: `getFollowsFilings(userId, params)` and `getFollowsAnalyses(userId, params)`
  - Both functions perform parameter parsing, validation (user existence), and SQL queries to return paginated results.

- src/controllers/userController.ts
  - Added: `getFollowsFilings` and `getFollowsAnalyses` controller endpoints which call the service methods and return JSON.

- src/routes/userRoutes.ts
  - Added routes:
    - `GET /:id/follows/filings` -> `userController.getFollowsFilings`
    - `GET /:id/follows/analyses` -> `userController.getFollowsAnalyses`

- tests/unit/userService.test.ts
  - Added unit tests covering the new service methods, including filters and pagination.

Notes

- The endpoints reuse the `user_favorites` table as the source of followed companies.
- Authorization: controller methods currently validate `:id` is numeric, but do not enforce that the authenticated user matches `:id` — add auth checks where appropriate.
- Performance: queries use joins and JSON field extraction; for large data sets consider adding indexes or materialized fields for `investment_signal` attributes.

If you want a single-file patch or a git commit message for these changes, tell me and I will prepare it.
