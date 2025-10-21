'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLatestAnalyses } from '@/hooks/use-api';
import { Brain, TrendingUp, TrendingDown, Calendar, ArrowDown } from 'lucide-react';
import type { Analysis } from '@/types/api';

export default function AnalysesPage() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useLatestAnalyses(20);

  const getRecommendationColor = (recommendation?: string) => {
    switch (recommendation) {
      case 'strong_buy':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'buy':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'hold':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
      case 'sell':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      case 'strong_sell':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
    }
  };

  const formatRecommendation = (rec?: string) => {
    if (!rec) return 'N/A';
    return rec.replace('_', ' ').toUpperCase();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const analyses = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analysis Feed</h1>
        <p className="text-muted-foreground">
          AI-powered insights from SEC filings
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
      ) : analyses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Brain className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No analyses found</h3>
            <p className="text-sm text-muted-foreground">
              Check back later for new AI-powered insights
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {analyses.map((analysis: Analysis) => (
              <Card key={analysis.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">
                          {analysis.ticker || analysis.metadata?.ticker}
                        </CardTitle>
                        <Badge variant="outline">
                          {analysis.filing_type || analysis.metadata?.filing_type}
                        </Badge>
                        {analysis.metadata?.fiscal_year && (
                          <Badge variant="secondary">
                            FY{analysis.metadata.fiscal_year}
                            {analysis.metadata.fiscal_quarter && ` Q${analysis.metadata.fiscal_quarter}`}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-base">
                        {analysis.company_title}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${getRecommendationColor(analysis.investment_signal?.recommendation)} text-sm px-3 py-1`}
                      >
                        {formatRecommendation(analysis.investment_signal?.recommendation)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Overall Score</p>
                      <div className="flex items-center gap-1">
                        {analysis.investment_signal?.overall_score !== undefined && (
                          <>
                            {analysis.investment_signal.overall_score >= 50 ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                            <span className="text-lg font-bold">
                              {analysis.investment_signal.overall_score}/100
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                      <p className="text-lg font-bold">
                        {analysis.investment_signal?.confidence_pct
                          ? `${analysis.investment_signal.confidence_pct}%`
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                      <p className="text-lg font-bold capitalize">
                        {analysis.investment_signal?.risk_level || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Filing Date</p>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {formatDate(analysis.filing_date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {analysis.analysis_data?.executive_summary && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Executive Summary</h4>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {analysis.analysis_data.executive_summary}
                      </p>
                    </div>
                  )}

                  {analysis.investment_signal?.key_drivers &&
                    analysis.investment_signal.key_drivers.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">
                          Key Drivers
                        </h4>
                        <ul className="space-y-1">
                          {analysis.investment_signal.key_drivers.slice(0, 3).map((driver, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                              <span>{driver}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {analysis.investment_signal?.concerns &&
                    analysis.investment_signal.concerns.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2 text-red-600 dark:text-red-400">
                          Concerns
                        </h4>
                        <ul className="space-y-1">
                          {analysis.investment_signal.concerns.slice(0, 3).map((concern, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                              <span>{concern}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Brain className="h-3 w-3" />
                      <span>Analyzed with {analysis.model_used}</span>
                      {analysis.tokens_used && (
                        <span className="ml-2">• {analysis.tokens_used.toLocaleString()} tokens</span>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  'Loading...'
                ) : (
                  <>
                    Load More
                    <ArrowDown className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
