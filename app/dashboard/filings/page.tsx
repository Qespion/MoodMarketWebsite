'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFilings, useAnalyses } from '@/hooks/use-api';
import { Calendar, Brain, ExternalLink, FileText, Filter, TrendingUp, TrendingDown, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import type { Filing, Analysis } from '@/types/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function FilingsPage() {
  const [filingType, setFilingType] = useState<string>('all');
  const [hasAnalysis, setHasAnalysis] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [selectedFilingId, setSelectedFilingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data, isLoading } = useFilings({
    page,
    limit: 20,
    filing_type: filingType !== 'all' ? filingType : undefined,
    has_analysis: hasAnalysis === 'true' ? true : hasAnalysis === 'false' ? false : undefined,
  });

  const { data: analysesData, isLoading: analysesLoading } = useAnalyses({
    filing_id: selectedFilingId || undefined,
  });

  const filings = data?.data || [];
  const pagination = data?.pagination;
  const selectedAnalysis = analysesData?.data?.[0];
  
  const getInvestmentSignal = (analysis: Analysis | undefined) => {
    return analysis?.investment_signal || analysis?.analysis_data?.investment_signal;
  };

  const getMetadata = (analysis: Analysis | undefined) => {
    return analysis?.metadata || analysis?.analysis_data?.metadata;
  };

  const getExecutiveSummary = (analysis: Analysis | undefined) => {
    return analysis?.analysis_data?.executive_summary;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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

  const handleViewAnalysis = (filingId: number) => {
    setSelectedFilingId(filingId);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SEC Filings</h1>
        <p className="text-muted-foreground">
          Browse recent SEC filings from tracked companies
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
              <CardDescription>Filter filings by type and analysis status</CardDescription>
            </div>
            {(filingType !== 'all' || hasAnalysis !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilingType('all');
                  setHasAnalysis('all');
                  setPage(1);
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Filing Type</label>
              <Select value={filingType} onValueChange={(value) => { setFilingType(value); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="All filing types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All filing types</SelectItem>
                  <SelectItem value="10-K">10-K (Annual Report)</SelectItem>
                  <SelectItem value="10-Q">10-Q (Quarterly Report)</SelectItem>
                  <SelectItem value="8-K">8-K (Current Report)</SelectItem>
                  <SelectItem value="DEF 14A">DEF 14A (Proxy Statement)</SelectItem>
                  <SelectItem value="S-1">S-1 (Registration Statement)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Analysis Status</label>
              <Select value={hasAnalysis} onValueChange={(value) => { setHasAnalysis(value); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="All filings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All filings</SelectItem>
                  <SelectItem value="true">Analyzed only</SelectItem>
                  <SelectItem value="false">Not analyzed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
      ) : filings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No filings found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or check back later
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {filings.map((filing: Filing) => (
              <Card key={filing.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">
                          {filing.ticker}
                        </CardTitle>
                        <Badge variant="outline">
                          {filing.filing_type}
                        </Badge>
                        {filing.has_analysis && (
                          <Badge variant="secondary" className="text-xs">
                            <Brain className="h-3 w-3 mr-1" />
                            Analyzed
                          </Badge>
                        )}
                        {filing.is_latest_10k && (
                          <Badge variant="secondary" className="text-xs">
                            Latest 10-K
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-base">
                        {filing.company_title}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Filing Date</p>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {formatDate(filing.filing_date)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Report Date</p>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {formatDate(filing.report_date)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">CIK</p>
                      <p className="text-sm font-medium font-mono">{filing.cik}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Accession Number</p>
                      <p className="text-sm font-medium font-mono text-xs">
                        {filing.accession_number}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t">
                    {filing.has_analysis && (
                      <Button variant="default" size="sm" onClick={() => handleViewAnalysis(filing.id)}>
                        <Brain className="mr-2 h-4 w-4" />
                        View Analysis
                      </Button>
                    )}
                    <a href={filing.filing_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        View Filing
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={!pagination.hasPrev}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAnalysis ? (
                <div className="flex items-center gap-2">
                  <span>{selectedAnalysis.ticker || getMetadata(selectedAnalysis)?.ticker}</span>
                  <Badge variant="outline">
                    {selectedAnalysis.filing_type || getMetadata(selectedAnalysis)?.filing_type}
                  </Badge>
                  {getMetadata(selectedAnalysis)?.fiscal_year && (
                    <Badge variant="secondary">
                      FY{getMetadata(selectedAnalysis)?.fiscal_year}
                      {getMetadata(selectedAnalysis)?.fiscal_quarter && ` Q${getMetadata(selectedAnalysis)?.fiscal_quarter}`}
                    </Badge>
                  )}
                  <Badge
                    className={`${getRecommendationColor(getInvestmentSignal(selectedAnalysis)?.recommendation)} text-sm px-3 py-1`}
                  >
                    {formatRecommendation(getInvestmentSignal(selectedAnalysis)?.recommendation)}
                  </Badge>
                </div>
              ) : (
                'Analysis'
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedAnalysis?.company_title || selectedAnalysis?.company?.title}
            </DialogDescription>
          </DialogHeader>

          {analysesLoading ? (
            <div className="space-y-4 py-8">
              <div className="h-20 animate-pulse bg-muted rounded-lg" />
              <div className="h-40 animate-pulse bg-muted rounded-lg" />
              <div className="h-40 animate-pulse bg-muted rounded-lg" />
            </div>
          ) : selectedAnalysis ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {getInvestmentSignal(selectedAnalysis)?.overall_score !== undefined && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Overall Score</p>
                    <div className="flex items-center gap-1">
                      {getInvestmentSignal(selectedAnalysis)!.overall_score! >= 50 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-lg font-bold">
                        {getInvestmentSignal(selectedAnalysis)!.overall_score}/100
                      </span>
                    </div>
                  </div>
                )}
                {getInvestmentSignal(selectedAnalysis)?.confidence_pct !== undefined && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                    <p className="text-lg font-bold">
                      {getInvestmentSignal(selectedAnalysis)!.confidence_pct}%
                    </p>
                  </div>
                )}
                {getInvestmentSignal(selectedAnalysis)?.risk_level && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                    <p className="text-lg font-bold capitalize">
                      {getInvestmentSignal(selectedAnalysis)!.risk_level}
                    </p>
                  </div>
                )}
                {getInvestmentSignal(selectedAnalysis)?.financial_health_score !== undefined && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Financial Health</p>
                    <p className="text-lg font-bold">
                      {getInvestmentSignal(selectedAnalysis)!.financial_health_score}/100
                    </p>
                  </div>
                )}
                {(selectedAnalysis.filing_date || selectedAnalysis.created_at) && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Filing Date</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {formatDate(selectedAnalysis.filing_date || selectedAnalysis.created_at)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {(getInvestmentSignal(selectedAnalysis)?.target_timeframe || getInvestmentSignal(selectedAnalysis)?.valuation_assessment || getInvestmentSignal(selectedAnalysis)?.event_significance) && (
                <div className="grid grid-cols-3 gap-4 border-t pt-4">
                  {getInvestmentSignal(selectedAnalysis)?.target_timeframe && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Target Timeframe</p>
                      <p className="text-sm font-medium">{getInvestmentSignal(selectedAnalysis)!.target_timeframe}</p>
                    </div>
                  )}
                  {getInvestmentSignal(selectedAnalysis)?.valuation_assessment && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Valuation</p>
                      <p className="text-sm font-medium capitalize">{getInvestmentSignal(selectedAnalysis)!.valuation_assessment.replace('_', ' ')}</p>
                    </div>
                  )}
                  {getInvestmentSignal(selectedAnalysis)?.event_significance && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Event Significance</p>
                      <p className="text-sm font-medium capitalize">{getInvestmentSignal(selectedAnalysis)!.event_significance}</p>
                    </div>
                  )}
                </div>
              )}

              {getInvestmentSignal(selectedAnalysis)?.investment_thesis && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Investment Thesis</h4>
                  <p className="text-sm text-muted-foreground">
                    {getInvestmentSignal(selectedAnalysis)!.investment_thesis}
                  </p>
                </div>
              )}

              {getExecutiveSummary(selectedAnalysis) && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Executive Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    {getExecutiveSummary(selectedAnalysis)}
                  </p>
                </div>
              )}

              {getInvestmentSignal(selectedAnalysis)?.strengths && getInvestmentSignal(selectedAnalysis)!.strengths!.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {getInvestmentSignal(selectedAnalysis)!.strengths!.map((strength: string, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {getInvestmentSignal(selectedAnalysis)?.weaknesses && getInvestmentSignal(selectedAnalysis)!.weaknesses!.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">
                    Weaknesses
                  </h4>
                  <ul className="space-y-1">
                    {getInvestmentSignal(selectedAnalysis)!.weaknesses!.map((weakness: string, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-orange-600 dark:text-orange-400 mt-1">!</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {getInvestmentSignal(selectedAnalysis)?.key_catalysts && getInvestmentSignal(selectedAnalysis)!.key_catalysts!.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">
                    Key Catalysts
                  </h4>
                  <ul className="space-y-1">
                    {getInvestmentSignal(selectedAnalysis)!.key_catalysts!.map((catalyst: string, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-1">▲</span>
                        <span>{catalyst}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {getInvestmentSignal(selectedAnalysis)?.key_risks && getInvestmentSignal(selectedAnalysis)!.key_risks!.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2 text-red-600 dark:text-red-400">
                    Key Risks
                  </h4>
                  <ul className="space-y-1">
                    {getInvestmentSignal(selectedAnalysis)!.key_risks!.map((risk: string, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-red-600 dark:text-red-400 mt-1">⚠</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {getInvestmentSignal(selectedAnalysis)?.key_drivers &&
                getInvestmentSignal(selectedAnalysis)!.key_drivers!.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">
                      Key Drivers
                    </h4>
                    <ul className="space-y-1">
                      {getInvestmentSignal(selectedAnalysis)!.key_drivers!.map((driver: string, idx: number) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                          <span>{driver}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {getInvestmentSignal(selectedAnalysis)?.concerns &&
                getInvestmentSignal(selectedAnalysis)!.concerns!.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2 text-red-600 dark:text-red-400">
                      Concerns
                    </h4>
                    <ul className="space-y-1">
                      {getInvestmentSignal(selectedAnalysis)!.concerns!.map((concern: string, idx: number) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                          <span>{concern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <p>No analysis data available</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
