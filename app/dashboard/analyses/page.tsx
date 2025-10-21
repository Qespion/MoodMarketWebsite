'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLatestAnalyses } from '@/hooks/use-api';
import { TrendingUp, TrendingDown, Calendar, ArrowDown } from 'lucide-react';
import type { Analysis } from '@/types/api';
import { useRouter } from 'next/navigation';

export default function AnalysesPage() {
  const router = useRouter();
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }) + ' ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
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
                          {analysis.ticker || analysis.analysis_data?.metadata?.ticker}
                        </CardTitle>
                        <Badge variant="outline">
                          {analysis.filing_type || analysis.analysis_data?.metadata?.filing_type}
                        </Badge>
                        {analysis.analysis_data?.metadata?.fiscal_year && (
                          <Badge variant="secondary">
                            FY{analysis.analysis_data.metadata.fiscal_year}
                            {analysis.analysis_data.metadata.fiscal_quarter && ` Q${analysis.analysis_data.metadata.fiscal_quarter}`}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-base">
                        {analysis.company_title}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${getRecommendationColor(analysis.analysis_data?.investment_signal?.recommendation)} text-sm px-3 py-1`}
                      >
                        {formatRecommendation(analysis.analysis_data?.investment_signal?.recommendation)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {analysis.analysis_data?.investment_signal?.overall_score !== undefined && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Overall Score</p>
                        <div className="flex items-center gap-1">
                          {analysis.analysis_data.investment_signal.overall_score >= 50 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-lg font-bold">
                            {analysis.analysis_data.investment_signal.overall_score}/100
                          </span>
                        </div>
                      </div>
                    )}
                    {analysis.analysis_data?.investment_signal?.confidence_pct !== undefined && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                        <p className="text-lg font-bold">
                          {analysis.analysis_data.investment_signal.confidence_pct}%
                        </p>
                      </div>
                    )}
                    {analysis.analysis_data?.investment_signal?.risk_level && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                        <p className="text-lg font-bold capitalize">
                          {analysis.analysis_data.investment_signal.risk_level}
                        </p>
                      </div>
                    )}
                    {analysis.analysis_data?.investment_signal?.financial_health_score !== undefined && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Financial Health</p>
                        <p className="text-lg font-bold">
                          {analysis.analysis_data.investment_signal.financial_health_score}/100
                        </p>
                      </div>
                    )}
                    {(analysis.filing_date || analysis.created_at) && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Filing Date</p>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {formatDate(analysis.filing_date || analysis.created_at)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {(analysis.analysis_data?.investment_signal?.target_timeframe || analysis.analysis_data?.investment_signal?.valuation_assessment || analysis.analysis_data?.investment_signal?.event_significance) && (
                    <div className="grid grid-cols-3 gap-4 border-t pt-4">
                      {analysis.analysis_data.investment_signal.target_timeframe && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Target Timeframe</p>
                          <p className="text-sm font-medium">{analysis.analysis_data.investment_signal.target_timeframe}</p>
                        </div>
                      )}
                      {analysis.analysis_data.investment_signal.valuation_assessment && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Valuation</p>
                          <p className="text-sm font-medium capitalize">{analysis.analysis_data.investment_signal.valuation_assessment.replace('_', ' ')}</p>
                        </div>
                      )}
                      {analysis.analysis_data.investment_signal.event_significance && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Event Significance</p>
                          <p className="text-sm font-medium capitalize">{analysis.analysis_data.investment_signal.event_significance}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {analysis.analysis_data?.investment_signal?.investment_thesis && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Investment Thesis</h4>
                      <p className="text-sm text-muted-foreground">
                        {analysis.analysis_data.investment_signal.investment_thesis}
                      </p>
                    </div>
                  )}

                  {analysis.analysis_data?.executive_summary && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Executive Summary</h4>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {analysis.analysis_data.executive_summary}
                      </p>
                    </div>
                  )}

                  {analysis.analysis_data?.investment_signal?.strengths && analysis.analysis_data.investment_signal.strengths.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {analysis.analysis_data.investment_signal.strengths.map((strength: string, idx: number) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.analysis_data?.investment_signal?.weaknesses && analysis.analysis_data.investment_signal.weaknesses.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">
                        Weaknesses
                      </h4>
                      <ul className="space-y-1">
                        {analysis.analysis_data.investment_signal.weaknesses.map((weakness: string, idx: number) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-orange-600 dark:text-orange-400 mt-1">!</span>
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.analysis_data?.investment_signal?.key_catalysts && analysis.analysis_data.investment_signal.key_catalysts.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">
                        Key Catalysts
                      </h4>
                      <ul className="space-y-1">
                        {analysis.analysis_data.investment_signal.key_catalysts.map((catalyst: string, idx: number) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-1">▲</span>
                            <span>{catalyst}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.analysis_data?.investment_signal?.key_risks && analysis.analysis_data.investment_signal.key_risks.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2 text-red-600 dark:text-red-400">
                        Key Risks
                      </h4>
                      <ul className="space-y-1">
                        {analysis.analysis_data.investment_signal.key_risks.map((risk: string, idx: number) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-red-600 dark:text-red-400 mt-1">⚠</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.analysis_data?.investment_signal?.key_drivers &&
                    analysis.analysis_data.investment_signal.key_drivers.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">
                          Key Drivers
                        </h4>
                        <ul className="space-y-1">
                          {analysis.analysis_data.investment_signal.key_drivers.map((driver: string, idx: number) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                              <span>{driver}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {analysis.analysis_data?.investment_signal?.concerns &&
                    analysis.analysis_data.investment_signal.concerns.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2 text-red-600 dark:text-red-400">
                          Concerns
                        </h4>
                        <ul className="space-y-1">
                          {analysis.analysis_data.investment_signal.concerns.map((concern: string, idx: number) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                              <span>{concern}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  <div className="flex items-center justify-end pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/dashboard/companies/${analysis.ticker || analysis.analysis_data?.metadata?.ticker}`)}
                    >
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
