export interface Company {
  id: number;
  cik: string;
  ticker: string;
  title: string;
  created_at: string;
  updated_at: string;
  filings_count?: number;
  analyses_count?: number;
}

export interface Filing {
  id: number;
  company_id: number;
  cik: string;
  accession_number: string;
  filing_type: string;
  filing_date: string;
  report_date: string;
  primary_document: string;
  document_url: string;
  filing_url: string;
  is_latest_10k: boolean;
  created_at: string;
  ticker?: string;
  company_title?: string;
  has_analysis?: boolean;
}

export interface InvestmentSignal {
  recommendation: 'buy' | 'hold' | 'sell' | 'strong_buy' | 'strong_sell';
  confidence_pct: number;
  overall_score: number;
  risk_level?: string;
  price_target?: number;
  timeframe?: string;
  key_drivers?: string[];
  concerns?: string[];
}

export interface FinancialSnapshot {
  revenue?: number;
  revenue_growth?: number;
  net_income?: number;
  eps?: number;
  operating_margin?: number;
  cash_flow?: number;
  debt_to_equity?: number;
  current_ratio?: number;
}

export interface SentimentAnalysis {
  overall_tone?: string;
  management_confidence?: string;
  forward_looking_score?: number;
  key_themes?: string[];
  positive_indicators?: string[];
  negative_indicators?: string[];
}

export interface GuidanceOutlook {
  has_guidance?: boolean;
  guidance_summary?: string;
  next_quarter_expectations?: string;
  full_year_outlook?: string;
  management_commentary?: string;
}

export interface KeyRisk {
  category?: string;
  description?: string;
  severity?: string;
  mitigation?: string;
}

export interface KeyOpportunity {
  category?: string;
  description?: string;
  potential_impact?: string;
  timeframe?: string;
}

export interface MaterialEvent {
  event_type?: string;
  description?: string;
  date?: string;
  impact?: string;
  significance?: string;
}

export interface AnalysisData {
  metadata: {
    ticker: string;
    filing_type: string;
    fiscal_year?: string;
    fiscal_quarter?: string;
  };
  investment_signal: InvestmentSignal;
  financial_snapshot?: FinancialSnapshot;
  sentiment_analysis?: SentimentAnalysis;
  guidance_and_outlook?: GuidanceOutlook;
  key_risks?: KeyRisk[];
  key_opportunities?: KeyOpportunity[];
  material_events?: MaterialEvent[];
  strategic_initiatives?: string[];
  executive_summary?: string;
  detailed_analysis?: string;
  comparable_analysis?: any;
}

export interface Analysis {
  id: number;
  filing_id: number;
  model_used: string;
  tokens_used: number | null;
  analysis_started_at: string;
  analysis_completed_at: string;
  created_at: string;
  metadata?: {
    ticker: string;
    filing_type: string;
    fiscal_year?: string;
    fiscal_quarter?: string;
  };
  investment_signal?: InvestmentSignal;
  analysis_data?: AnalysisData;
  filing?: Partial<Filing>;
  company?: Partial<Company>;
  accession_number?: string;
  filing_date?: string;
  filing_type?: string;
  company_id?: number;
  ticker?: string;
  company_title?: string;
  cik?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CursorPagination {
  next: string | null;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface CursorPaginatedResponse<T> {
  data: T[];
  cursor: CursorPagination;
  meta: {
    count: number;
    limit: number;
  };
}

export interface DashboardStats {
  companies_count: number;
  filings_count: number;
  analyses_count: number;
  latest_analyses: Analysis[];
  recent_filings: Filing[];
}

export interface TrendingCompany {
  ticker: string;
  company_title: string;
  analyses_count: number;
  latest_recommendation?: string;
  avg_confidence?: number;
  avg_score?: number;
}

export interface SearchResult {
  companies: Company[];
  filings: Filing[];
  analyses: Analysis[];
}
