import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companiesApi, filingsApi, analysesApi, dashboardApi, searchApi, trendingApi, usersApi } from '@/lib/api';
import type { Analysis } from '@/types/api';

export const useCompanies = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: ['companies', params],
    queryFn: () => companiesApi.getAll(params).then((res) => res.data),
  });
};

export const useCompany = (id: number) => {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => companiesApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useCompanyByTicker = (ticker: string) => {
  return useQuery({
    queryKey: ['company', 'ticker', ticker],
    queryFn: () => companiesApi.getByTicker(ticker).then((res) => res.data),
    enabled: !!ticker,
  });
};

export const useFilings = (params?: {
  page?: number;
  limit?: number;
  company_id?: number;
  ticker?: string;
  filing_type?: string;
  has_analysis?: boolean;
  from_date?: string;
  to_date?: string;
  is_latest_10k?: boolean;
  is_latest_10q?: boolean;
  sort?: string;
  order?: 'ASC' | 'DESC';
}) => {
  return useQuery({
    queryKey: ['filings', params],
    queryFn: () => filingsApi.getAll(params).then((res) => res.data),
  });
};

export const useFiling = (id: number) => {
  return useQuery({
    queryKey: ['filing', id],
    queryFn: () => filingsApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useAnalyses = (params?: {
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
}) => {
  return useQuery({
    queryKey: ['analyses', params],
    queryFn: () => analysesApi.getAll(params).then((res) => res.data),
  });
};

export const useLatestAnalyses = (limit = 20) => {
  return useInfiniteQuery({
    queryKey: ['analyses', 'latest', limit],
    queryFn: ({ pageParam }) =>
      analysesApi.getLatest({ limit, cursor: pageParam }).then((res) => res.data),
    getNextPageParam: (lastPage) =>
      lastPage.cursor.hasMore ? lastPage.cursor.next : undefined,
    initialPageParam: undefined as string | undefined,
  });
};

export const useAnalysis = (id: number) => {
  return useQuery({
    queryKey: ['analysis', id],
    queryFn: () =>
      analysesApi.getById(id, { include_filing: true, include_company: true }).then((res) => res.data),
    enabled: !!id,
  });
};

export const useAnalysisMetrics = (id: number) => {
  return useQuery({
    queryKey: ['analysis', id, 'metrics'],
    queryFn: () => analysesApi.getMetrics(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardApi.getStats().then((res) => res.data),
  });
};

export const useSearch = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchApi.search(query).then((res) => res.data),
    enabled: query.length > 0,
  });
};

export const useTrendingCompanies = (params?: { limit?: number; period?: string }) => {
  return useQuery({
    queryKey: ['trending', 'companies', params],
    queryFn: () => trendingApi.getCompanies(params).then((res) => res.data),
  });
};

export const useLatestFilings = (params?: { limit?: number; sort?: string; order?: 'ASC' | 'DESC' }) => {
  return useQuery({
    queryKey: ['filings', 'latest', params],
    queryFn: () => filingsApi.getAll({ ...params, sort: params?.sort || 'filing_date', order: (params?.order as 'ASC' | 'DESC') || 'DESC' }).then((res) => res.data),
  });
};

export const useUserFollowsFilings = (userId?: number | string, params?: {
  page?: number;
  limit?: number;
  filing_type?: string;
  from_date?: string;
  to_date?: string;
  has_analysis?: boolean;
  is_latest_10k?: boolean;
  is_latest_10q?: boolean;
  sort?: string;
  order?: 'ASC' | 'DESC';
}) => {
  return useQuery({
    queryKey: ['users', userId, 'follows', 'filings', params],
    queryFn: () => usersApi.getFollowsFilings(userId || '', params).then((res) => res.data),
    enabled: !!userId,
  });
};

export const useUserFollowsAnalyses = (userId?: number | string, params?: {
  page?: number;
  limit?: number;
  filing_id?: number;
  ticker?: string;
  filing_type?: string;
  recommendation?: string;
  min_confidence?: number;
}) => {
  return useQuery({
    queryKey: ['users', userId, 'follows', 'analyses', params],
    queryFn: () => usersApi.getFollowsAnalyses(userId || '', params).then((res) => res.data),
    enabled: !!userId,
  });
};
