'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDashboardStats, useTrendingCompanies, useLatestAnalyses } from '@/hooks/use-api';
import { TrendingUp, TrendingDown, Building2, FileText, Brain, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Analysis } from '@/types/api';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: trending, isLoading: trendingLoading } = useTrendingCompanies({ limit: 5, period: '7d' });
  const { data: latestAnalysesData, isLoading: analysesLoading } = useLatestAnalyses(5);
  const latestAnalyses = latestAnalysesData?.pages[0]?.data || [];

  const getRecommendationColor = (recommendation?: string) => {
    switch (recommendation) {
      case 'strong_buy':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'buy':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'hold':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
      case 'sell':
        return 'bg-red-500/10 text-red-600 dark:text-red-400';
      case 'strong_sell':
        return 'bg-red-500/10 text-red-600 dark:text-red-400';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
    }
  };

  const formatRecommendation = (rec?: string) => {
    if (!rec) return 'N/A';
    return rec.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor market insights and AI-powered SEC filing analyses
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies Tracked</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="h-7 w-20 animate-pulse bg-muted rounded" />
            ) : (
              <div className="text-2xl font-bold">{stats?.companies.total.toLocaleString()}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SEC Filings</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="h-7 w-20 animate-pulse bg-muted rounded" />
            ) : (
              <div className="text-2xl font-bold">{stats?.filings.total.toLocaleString()}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Analyses</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="h-7 w-20 animate-pulse bg-muted rounded" />
            ) : (
              <div className="text-2xl font-bold">{stats?.analyses.total.toLocaleString()}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Latest Analyses</CardTitle>
            <CardDescription>Most recent AI-powered SEC filing analyses</CardDescription>
          </CardHeader>
          <CardContent>
            {analysesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse bg-muted rounded" />
                ))}
              </div>
            ) : latestAnalyses && latestAnalyses.length > 0 ? (
              <div className="space-y-3">
                {latestAnalyses.slice(0, 5).map((analysis: Analysis) => (
                  <Link
                    key={analysis.id}
                    href={`/dashboard/companies/${analysis.ticker || analysis.analysis_data?.metadata?.ticker}#analysis-${analysis.id}`}
                  >
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{analysis.ticker || analysis.analysis_data?.metadata?.ticker}</span>
                          <Badge variant="outline" className="text-xs">
                            {analysis.filing_type || analysis.analysis_data?.metadata?.filing_type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {analysis.company_title}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRecommendationColor(analysis.analysis_data?.investment_signal?.recommendation)}>
                          {formatRecommendation(analysis.analysis_data?.investment_signal?.recommendation)}
                        </Badge>
                        {analysis.analysis_data?.investment_signal?.overall_score && (
                          <div className="text-sm font-medium">
                            {analysis.analysis_data.investment_signal.overall_score}/100
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No analyses available yet
              </p>
            )}
            <div className="mt-4">
              <Link href="/dashboard/analyses">
                <Button variant="outline" className="w-full">
                  View All Analyses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trending Companies</CardTitle>
            <CardDescription>Most analyzed companies in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {trendingLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse bg-muted rounded" />
                ))}
              </div>
            ) : trending && trending.length > 0 ? (
              <div className="space-y-3">
                {trending.map((company) => (
                  <div
                    key={company.ticker}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{company.ticker}</span>
                        <Badge variant="secondary" className="text-xs">
                          {company.analysis_count} analyses
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {company.company_title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {company.latest_recommendation && (
                        <Badge className={getRecommendationColor(company.latest_recommendation)}>
                          {formatRecommendation(company.latest_recommendation)}
                        </Badge>
                      )}
                      {company.avg_score && (
                        <div className="flex items-center gap-1">
                          {company.avg_score >= 50 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm font-medium">{company.avg_score.toFixed(0)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No trending companies yet
              </p>
            )}
            <div className="mt-4">
              <Link href="/dashboard/companies">
                <Button variant="outline" className="w-full">
                  Explore Companies
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
