'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useCompanyByTicker, useFilings, useAnalyses } from '@/hooks/use-api';
import {
  Building2,
  TrendingUp,
  TrendingDown,
  FileText,
  Brain,
  Calendar,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import type { Filing, Analysis } from '@/types/api';

interface CompanyDetailPageProps {
  params: { ticker: string };
}

export default function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { ticker } = params;
  const decodedTicker = decodeURIComponent(ticker).toUpperCase();

  const { data: company, isLoading: companyLoading } = useCompanyByTicker(decodedTicker);
  const { data: filingsData, isLoading: filingsLoading } = useFilings({
    ticker: decodedTicker,
    limit: 10,
  });
  const { data: analysesData, isLoading: analysesLoading } = useAnalyses({
    ticker: decodedTicker,
    limit: 10,
  });

  const filings = filingsData?.data ?? [];
  const analyses = analysesData?.data ?? [];

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

  if (companyLoading) {
    return (
      <div className="space-y-8">
        <div className="h-20 animate-pulse bg-muted rounded-lg" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="space-y-8">
        <Link href="/dashboard/companies">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Button>
        </Link>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Company not found</h3>
            <p className="text-sm text-muted-foreground">
              Unable to find company with ticker: {decodedTicker}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/companies">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Button>
        </Link>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold tracking-tight">{company.ticker}</h1>
          <Badge variant="outline">CIK: {company.cik}</Badge>
        </div>
        <p className="text-xl text-muted-foreground">{company.title}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Filings</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{company.filings_count?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">SEC documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Analyses</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{company.analyses_count?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Generated insights</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Signal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {analyses[0]?.investment_signal ? (
              <>
                <Badge className={getRecommendationColor(analyses[0].investment_signal.recommendation)}>
                  {formatRecommendation(analyses[0].investment_signal.recommendation)}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  Score: {analyses[0].investment_signal.overall_score}/100
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No signal available</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analyses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analyses">Analyses</TabsTrigger>
          <TabsTrigger value="filings">Filings</TabsTrigger>
        </TabsList>

        <TabsContent value="analyses" className="space-y-4">
          {analysesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 animate-pulse bg-muted rounded-lg" />
              ))}
            </div>
          ) : analyses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No analyses found</h3>
                <p className="text-sm text-muted-foreground">
                  No AI analyses available for this company yet
                </p>
              </CardContent>
            </Card>
          ) : (
            analyses.map((analysis: Analysis) => (
              <Card key={analysis.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle>
                          {analysis.filing_type || analysis.metadata?.filing_type}
                        </CardTitle>
                        {analysis.metadata?.fiscal_year && (
                          <Badge variant="secondary">
                            FY{analysis.metadata.fiscal_year}
                            {analysis.metadata.fiscal_quarter && ` Q${analysis.metadata.fiscal_quarter}`}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {formatDate(analysis.filing_date)}
                      </CardDescription>
                    </div>
                    <Badge
                      className={getRecommendationColor(analysis.investment_signal?.recommendation)}
                    >
                      {formatRecommendation(analysis.investment_signal?.recommendation)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Score</p>
                      <div className="flex items-center gap-1">
                        {analysis.investment_signal?.overall_score !== undefined && (
                          <>
                            {analysis.investment_signal.overall_score >= 50 ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                            <span className="font-bold">{analysis.investment_signal.overall_score}/100</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                      <p className="font-bold">
                        {analysis.investment_signal?.confidence_pct
                          ? `${analysis.investment_signal.confidence_pct}%`
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Risk</p>
                      <p className="font-bold capitalize">
                        {analysis.investment_signal?.risk_level || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {analysis.analysis_data?.executive_summary && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Executive Summary</h4>
                        <p className="text-sm text-muted-foreground">
                          {analysis.analysis_data.executive_summary}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="filings" className="space-y-4">
          {filingsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 animate-pulse bg-muted rounded-lg" />
              ))}
            </div>
          ) : filings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No filings found</h3>
                <p className="text-sm text-muted-foreground">
                  No SEC filings available for this company yet
                </p>
              </CardContent>
            </Card>
          ) : (
            filings.map((filing: Filing) => (
              <Card key={filing.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle>{filing.filing_type}</CardTitle>
                        {filing.is_latest_10k && (
                          <Badge variant="default">Latest 10-K</Badge>
                        )}
                        {filing.has_analysis && (
                          <Badge variant="secondary">
                            <Brain className="h-3 w-3 mr-1" />
                            Analyzed
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        Filed: {formatDate(filing.filing_date)}
                        <span className="mx-2">•</span>
                        Period: {formatDate(filing.report_date)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={filing.document_url} target="_blank" rel="noopener noreferrer">
                        View Document
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={filing.filing_url} target="_blank" rel="noopener noreferrer">
                        SEC Filing Page
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
