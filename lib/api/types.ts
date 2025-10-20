const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://iw0g4808sw8ks4oco0k4gwsg.158.69.200.14.sslip.io';

export const API_ENDPOINTS = {
  INFO: `${API_BASE_URL}/api/info`,
  ANALYSES_LATEST: `${API_BASE_URL}/api/analyses/latest`,
  ANALYSIS_BY_ID: (id: string) => `${API_BASE_URL}/api/analysis/${id}`,
  COMPANY_ANALYSES: (ticker: string) => `${API_BASE_URL}/api/company/${ticker}/analyses`,
  SEARCH_COMPANIES: `${API_BASE_URL}/api/search/companies`,
} as const;

export interface ApiInfo {
  company_count: number;
  filing_count: number;
  analysis_count: number;
  supported_filing_types: string[];
  ai_models: string[];
}

export interface Analysis {
  id: number;
  filing_id: number;
  model_used: string;
  tokens_used: number | null;
  analysis_started_at: string;
  analysis_completed_at: string;
  created_at: string;
  analysis_data: {
    metadata: {
      ticker: string;
      company_name: string;
      filing_type: string;
      filing_date: string;
      industry_sector: string | null;
    };
    investment_signal: {
      recommendation: string;
      investment_thesis: string;
      confidence_pct: number;
      key_risks: string[];
      key_catalysts: string[];
      event_significance: string;
    };
    sentiment_analysis: {
      overall_sentiment: string;
      market_relevance: string;
      positive_indicators: string[];
      negative_indicators: string[];
    };
    event_details?: {
      event_type: string;
      event_description: string;
    };
  };
  ticker: string;
  company_title: string;
  filing_type: string;
  filing_date: string;
}

export interface AnalysesResponse {
  data: Analysis[];
  cursor: {
    next: string | null;
    hasMore: boolean;
  };
  meta: {
    count: number;
    limit: number;
  };
}

export interface Company {
  ticker: string;
  name: string;
  sector?: string;
  industry?: string;
}
