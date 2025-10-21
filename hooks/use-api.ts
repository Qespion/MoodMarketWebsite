import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companiesApi, filingsApi, analysesApi, dashboardApi, searchApi, trendingApi } from '@/lib/api';
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
  ticker?: string;
  filing_type?: string;
  recommendation?: string;
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

export const useTrendingCompanies = (params?: { limit?: number; days?: number }) => {
  return useQuery({
    queryKey: ['trending', 'companies', params],
    queryFn: () => trendingApi.getCompanies(params).then((res) => res.data),
  });
};
