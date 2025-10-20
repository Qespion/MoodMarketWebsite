import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { apiService } from './client';

export const useApiInfo = () => {
  return useQuery({
    queryKey: ['api-info'],
    queryFn: () => apiService.getInfo(),
  });
};

export const useLatestAnalyses = () => {
  return useInfiniteQuery({
    queryKey: ['analyses', 'latest'],
    queryFn: ({ pageParam }) => apiService.getLatestAnalyses(pageParam),
    getNextPageParam: (lastPage) => lastPage.cursor.hasMore ? lastPage.cursor.next : undefined,
    initialPageParam: undefined as string | undefined,
  });
};

export const useAnalysisById = (id: string) => {
  return useQuery({
    queryKey: ['analysis', id],
    queryFn: () => apiService.getAnalysisById(id),
    enabled: !!id,
  });
};

export const useCompanyAnalyses = (ticker: string) => {
  return useInfiniteQuery({
    queryKey: ['company-analyses', ticker],
    queryFn: ({ pageParam }) => apiService.getCompanyAnalyses(ticker, pageParam),
    getNextPageParam: (lastPage) => lastPage.cursor.hasMore ? lastPage.cursor.next : undefined,
    initialPageParam: undefined as string | undefined,
    enabled: !!ticker,
  });
};

export const useSearchCompanies = (query: string) => {
  return useQuery({
    queryKey: ['search-companies', query],
    queryFn: () => apiService.searchCompanies(query),
    enabled: query.length > 0,
  });
};
