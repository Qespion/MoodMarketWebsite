'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDashboardStats, useLatestFilings, useLatestAnalyses, useAnalysis, useAnalyses, useFiling } from '@/hooks/use-api';
import { Building2, FileText, Brain, ArrowRight, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Analysis, Filing } from '@/types/api';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: filingsData, isLoading: filingsLoading } = useLatestFilings({ limit: 5 });
  const latestFilings = filingsData?.data || [];
  const { data: latestAnalysesData, isLoading: analysesLoading } = useLatestAnalyses(5);
  const latestAnalyses = latestAnalysesData?.pages[0]?.data || [];

  const [selectedAnalysisId, setSelectedAnalysisId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilingId, setSelectedFilingId] = useState<number | null>(null);

  const { data: selectedAnalysis, isLoading: selectedAnalysisLoading } = useAnalysis(selectedAnalysisId || 0);

  const { data: filingAnalysis } = useAnalyses({ filing_id: selectedFilingId || undefined });

  const { data: selectedFiling } = useFiling(selectedAnalysis?.filing_id || 0);

  useEffect(() => {
    if (filingAnalysis?.data?.[0] && isModalOpen && !selectedAnalysisId) {
      setSelectedAnalysisId(filingAnalysis.data[0].id);
    }
  }, [filingAnalysis, isModalOpen, selectedAnalysisId]);

  const openAnalysisModal = (id: number) => { setSelectedAnalysisId(id); setIsModalOpen(true); };

  const handleFilingClick = (filing: Filing) => {
    if (filing.has_analysis) {
      setSelectedFilingId(filing.id);
      setIsModalOpen(true);
    } else {
      window.open(filing.filing_url, '_blank');
    }
  };

  const investmentSignal = selectedAnalysis ? (selectedAnalysis.investment_signal || selectedAnalysis.analysis_data?.investment_signal) : undefined;
  const metadata = selectedAnalysis ? (selectedAnalysis.metadata || selectedAnalysis.analysis_data?.metadata) : undefined;
  const getExecutiveSummary = (analysis?: Analysis) => analysis?.analysis_data?.executive_summary;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
              <div>
                {latestAnalyses.slice(0, 5).map((analysis: Analysis) => (
                  <div
                    key={analysis.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openAnalysisModal(analysis.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAnalysisModal(analysis.id); } }}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{analysis.ticker || analysis.analysis_data?.metadata?.ticker}</span>
                          <Badge variant="outline" className="text-xs">
                            {analysis.filing_type || analysis.analysis_data?.metadata?.filing_type}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Brain className="h-3 w-3 mr-1" />
                            Analyzed
                          </Badge>
                        </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {analysis.company_title}
                      </p>
                    </div>
                         <div className="flex items-center gap-1 text-sm text-muted-foreground">
                           <Calendar className="h-3 w-3" />
                           <span>{formatDate(analysis.filing?.filing_date || analysis.metadata?.filing_date || analysis.filing_date || analysis.created_at)}</span>
                         </div>
                  </div>
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
            <CardTitle>Latest Filings</CardTitle>
            <CardDescription>Most recent SEC filings from tracked companies</CardDescription>
          </CardHeader>
          <CardContent>
            {filingsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse bg-muted rounded" />
                ))}
              </div>
            ) : latestFilings && latestFilings.length > 0 ? (
              <div className="space-y-3">
                {latestFilings.map((filing) => (
                  <div
                    key={filing.id}
                    onClick={() => handleFilingClick(filing)}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2">
                         <span className="font-semibold">{filing.ticker}</span>
                         <Badge variant="outline" className="text-xs">
                           {filing.filing_type}
                         </Badge>
                         {filing.has_analysis && (
                           <Badge variant="secondary" className="text-xs">
                             <Brain className="h-3 w-3 mr-1" />
                             Analyzed
                           </Badge>
                         )}
                       </div>
                       <p className="text-sm text-muted-foreground truncate">
                         {filing.company_title}
                       </p>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(filing.filing_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} {new Date(filing.filing_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No filings available yet
              </p>
            )}
            <div className="mt-4">
              <Link href="/dashboard/filings">
                <Button variant="outline" className="w-full">
                  View All Filings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={(open) => { setIsModalOpen(open); if (!open) setSelectedAnalysisId(null); }}>
        <DialogContent className="w-full h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAnalysis ? (
                <div className="flex items-center gap-2">
                  <span>{selectedAnalysis.ticker || metadata?.ticker}</span>
                  <Badge variant="outline">
                    {selectedAnalysis.filing_type || metadata?.filing_type}
                  </Badge>
                  {metadata?.fiscal_year && (
                    <Badge variant="secondary">
                      FY{metadata.fiscal_year}
                      {metadata?.fiscal_quarter && ` Q${metadata.fiscal_quarter}`}
                    </Badge>
                  )}
                  <Badge
                    className={`${getRecommendationColor(investmentSignal?.recommendation)} text-sm px-3 py-1`}
                  >
                    {formatRecommendation(investmentSignal?.recommendation)}
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

          {selectedAnalysisLoading ? (
            <div className="space-y-4 py-8">
              <div className="h-20 animate-pulse bg-muted rounded-lg" />
              <div className="h-40 animate-pulse bg-muted rounded-lg" />
              <div className="h-40 animate-pulse bg-muted rounded-lg" />
            </div>
          ) : selectedAnalysis ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {investmentSignal?.overall_score !== undefined && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Overall Score</p>
                    <div className="flex items-center gap-1">
                      {investmentSignal!.overall_score! >= 50 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-lg font-bold">
                        {investmentSignal!.overall_score}/100
                      </span>
                    </div>
                  </div>
                )}
                {investmentSignal?.confidence_pct !== undefined && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                    <p className="text-lg font-bold">
                      {investmentSignal!.confidence_pct}%
                    </p>
                  </div>
                )}
                {investmentSignal?.risk_level && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                    <p className="text-lg font-bold capitalize">
                      {investmentSignal!.risk_level}
                    </p>
                  </div>
                )}
                {investmentSignal?.financial_health_score !== undefined && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Financial Health</p>
                    <p className="text-lg font-bold">
                      {investmentSignal!.financial_health_score}/100
                    </p>
                  </div>
                )}
                {(selectedAnalysis.filing_date || selectedAnalysis.created_at) && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Filing Date</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                       <span className="text-sm font-medium">
                         {formatDate(selectedAnalysis.filing?.filing_date || selectedAnalysis.metadata?.filing_date || selectedAnalysis.filing_date || selectedAnalysis.created_at)}
                       </span>
                    </div>
                  </div>
                )}
              </div>

              {(investmentSignal?.target_timeframe || investmentSignal?.valuation_assessment || investmentSignal?.event_significance) && (
                <div className="grid grid-cols-3 gap-4 border-t pt-4">
                  {investmentSignal?.target_timeframe && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Target Timeframe</p>
                      <p className="text-sm font-medium">{investmentSignal!.target_timeframe}</p>
                    </div>
                  )}
                  {investmentSignal?.valuation_assessment && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Valuation</p>
                      <p className="text-sm font-medium capitalize">{investmentSignal!.valuation_assessment.replace('_', ' ')}</p>
                    </div>
                  )}
                  {investmentSignal?.event_significance && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Event Significance</p>
                      <p className="text-sm font-medium capitalize">{investmentSignal!.event_significance}</p>
                    </div>
                  )}
                </div>
              )}

              {investmentSignal?.investment_thesis && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Investment Thesis</h4>
                  <p className="text-sm text-muted-foreground">
                    {investmentSignal!.investment_thesis}
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

              {investmentSignal?.strengths && investmentSignal!.strengths!.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {investmentSignal!.strengths!.map((strength: string, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {investmentSignal?.weaknesses && investmentSignal!.weaknesses!.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">
                    Weaknesses
                  </h4>
                  <ul className="space-y-1">
                    {investmentSignal!.weaknesses!.map((weakness: string, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-orange-600 dark:text-orange-400 mt-1">!</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {investmentSignal?.key_catalysts && investmentSignal!.key_catalysts!.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">
                    Key Catalysts
                  </h4>
                  <ul className="space-y-1">
                    {investmentSignal!.key_catalysts!.map((catalyst: string, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-1">▲</span>
                        <span>{catalyst}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {investmentSignal?.key_risks && investmentSignal!.key_risks!.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2 text-red-600 dark:text-red-400">
                    Key Risks
                  </h4>
                  <ul className="space-y-1">
                    {investmentSignal!.key_risks!.map((risk: string, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-red-600 dark:text-red-400 mt-1">⚠</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {investmentSignal?.key_drivers && investmentSignal!.key_drivers!.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">
                      Key Drivers
                    </h4>
                    <ul className="space-y-1">
                      {investmentSignal!.key_drivers!.map((driver: string, idx: number) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                          <span>{driver}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {investmentSignal?.concerns && investmentSignal!.concerns!.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2 text-red-600 dark:text-red-400">
                      Concerns
                    </h4>
                    <ul className="space-y-1">
                      {investmentSignal!.concerns!.map((concern: string, idx: number) => (
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

           {selectedAnalysis && selectedFiling && (
             <div className="flex justify-end gap-2 mt-6">
               <Button
                 variant="outline"
                 onClick={() => window.open(selectedFiling.document_url, '_blank')}
               >
                 View Document
               </Button>
               <Button
                 variant="outline"
                 onClick={() => window.open(selectedFiling.filing_url, '_blank')}
               >
                 SEC Filing Page
               </Button>
             </div>
           )}
         </DialogContent>
      </Dialog>
    </div>
  );
}
