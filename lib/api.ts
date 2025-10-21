import axios from 'axios';
import { API_BASE_URL } from './config';
import type {
  Company,
  Filing,
  Analysis,
  PaginatedResponse,
  CursorPaginatedResponse,
  DashboardStats,
  TrendingCompany,
  SearchResult,
} from '@/types/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const companiesApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => apiClient.get<PaginatedResponse<Company>>('/companies', { params }),

  getById: (id: number) => apiClient.get<Company>(`/companies/${id}`),

  getByTicker: (ticker: string) => apiClient.get<Company>(`/companies/ticker/${ticker}`),

  getByCik: (cik: string) => apiClient.get<Company>(`/companies/cik/${cik}`),

  getAliases: (id: number) => apiClient.get(`/companies/${id}/aliases`),
};

export const filingsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    company_id?: number;
    ticker?: string;
    filing_type?: string;
    from_date?: string;
    to_date?: string;
    is_latest_10k?: boolean;
    is_latest_10q?: boolean;
    has_analysis?: boolean;
    sort?: string;
    order?: 'ASC' | 'DESC';
  }) => apiClient.get<PaginatedResponse<Filing>>('/filings', { params }),

  getById: (id: number) => apiClient.get<Filing>(`/filings/${id}`),

  getByAccession: (accessionNumber: string) =>
    apiClient.get<Filing>(`/filings/accession/${accessionNumber}`),

  getLatestByType: (filingType: string, limit = 10) =>
    apiClient.get<Filing[]>(`/filings/latest/${filingType}`, {
      params: { limit },
    }),

  getStats: (params?: { company_id?: number; ticker?: string }) =>
    apiClient.get('/filings/stats', { params }),
};

export const analysesApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    filing_id?: number;
    company_id?: number;
    ticker?: string;
    filing_type?: string;
    model_used?: string;
    recommendation?: string;
    risk_level?: string;
    min_confidence?: number;
    min_score?: number;
    has_guidance?: boolean;
    from_date?: string;
    to_date?: string;
    sort?: string;
    order?: 'ASC' | 'DESC';
  }) => apiClient.get<PaginatedResponse<Analysis>>('/analyses', { params }),

  getLatest: (params?: { limit?: number; cursor?: string }) =>
    apiClient.get<CursorPaginatedResponse<Analysis>>('/analyses/latest', {
      params,
    }),

  getById: (id: number, params?: { include_filing?: boolean; include_company?: boolean }) =>
    apiClient.get<Analysis>(`/analyses/${id}`, { params }),

  getMetrics: (id: number) => apiClient.get(`/analyses/${id}/metrics`),

  getStats: (params?: {
    company_id?: number;
    ticker?: string;
    filing_type?: string;
  }) => apiClient.get('/analyses/stats', { params }),
};

export const dashboardApi = {
  getStats: () => apiClient.get<DashboardStats>('/dashboard'),
};

export const searchApi = {
  search: (query: string) =>
    apiClient.get<SearchResult>('/search', { params: { q: query } }),
};

export const trendingApi = {
  getCompanies: (params?: { limit?: number; period?: string }) =>
    apiClient.get<TrendingCompany[]>('/trending/companies', { params }),
};

export const healthApi = {
  check: () => apiClient.get('/health'),
};
