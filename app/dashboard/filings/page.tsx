'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFilings } from '@/hooks/use-api';
import { Calendar, Brain, ExternalLink, FileText, Filter } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import type { Filing } from '@/types/api';
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
  
  const { data, isLoading } = useFilings({
    page,
    limit: 20,
    filing_type: filingType !== 'all' ? filingType : undefined,
    has_analysis: hasAnalysis === 'true' ? true : hasAnalysis === 'false' ? false : undefined,
  });

  const filings = data?.data || [];
  const pagination = data?.pagination;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
                      <Link href={`/dashboard/companies/${filing.ticker}`}>
                        <Button variant="default" size="sm">
                          <Brain className="mr-2 h-4 w-4" />
                          View Analysis
                        </Button>
                      </Link>
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
    </div>
  );
}
