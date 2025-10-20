import axios from 'axios';
import { API_ENDPOINTS, ApiInfo, AnalysesResponse, Analysis, Company } from './types';

const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  async getInfo(): Promise<ApiInfo> {
    const { data } = await apiClient.get<ApiInfo>(API_ENDPOINTS.INFO);
    return data;
  },

  async getLatestAnalyses(cursor?: string, limit: number = 20): Promise<AnalysesResponse> {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('limit', limit.toString());
    
    const { data } = await apiClient.get<AnalysesResponse>(
      `${API_ENDPOINTS.ANALYSES_LATEST}?${params.toString()}`
    );
    return data;
  },

  async getAnalysisById(id: string): Promise<Analysis> {
    const { data } = await apiClient.get<Analysis>(API_ENDPOINTS.ANALYSIS_BY_ID(id));
    return data;
  },

  async getCompanyAnalyses(ticker: string, cursor?: string, limit: number = 20): Promise<AnalysesResponse> {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('limit', limit.toString());
    
    const { data } = await apiClient.get<AnalysesResponse>(
      `${API_ENDPOINTS.COMPANY_ANALYSES(ticker)}?${params.toString()}`
    );
    return data;
  },

  async searchCompanies(query: string): Promise<Company[]> {
    const { data } = await apiClient.get<{ companies: Company[] }>(
      `${API_ENDPOINTS.SEARCH_COMPANIES}?q=${encodeURIComponent(query)}`
    );
    return data.companies;
  },
};
