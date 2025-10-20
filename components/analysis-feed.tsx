'use client';

import { useMemo } from 'react';
import { useLatestAnalyses } from '@/lib/api/hooks';
import { Analysis } from '@/lib/api/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { FilterState } from './filter-bar';

function SentimentBadge({ sentiment, score }: { sentiment: string; score: number }) {
  const getColor = () => {
    if (sentiment === 'positive') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (sentiment === 'negative') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const getIcon = () => {
    if (sentiment === 'positive') return <TrendingUp className="w-4 h-4" />;
    if (sentiment === 'negative') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getColor()}`}>
      {getIcon()}
      {sentiment} ({score.toFixed(2)})
    </span>
  );
}

function AnalysisCard({ analysis }: { analysis: Analysis }) {
  const { analysis_data, ticker, company_title, filing_type, filing_date, model_used, created_at } = analysis;
  const sentiment = analysis_data.sentiment_analysis.overall_sentiment;
  const confidence = analysis_data.investment_signal.confidence_pct;
  
  const getRecommendationColor = (rec: string) => {
    if (rec === 'buy') return 'text-green-600 dark:text-green-400';
    if (rec === 'sell') return 'text-red-600 dark:text-red-400';
    return 'text-yellow-600 dark:text-yellow-400';
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-xl transition-all bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {ticker} - {company_title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700">
              {filing_type}
            </span>
            <span>•</span>
            <span>{new Date(filing_date).toLocaleDateString()}</span>
            <span>•</span>
            <span className={`font-semibold uppercase ${getRecommendationColor(analysis_data.investment_signal.recommendation)}`}>
              {analysis_data.investment_signal.recommendation}
            </span>
            <span>•</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium">
              {analysis_data.investment_signal.event_significance}
            </span>
            <span>•</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-medium">
              {analysis_data.sentiment_analysis.market_relevance} relevance
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <SentimentBadge sentiment={sentiment} score={confidence / 100} />
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {analysis_data.investment_signal.investment_thesis}
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {analysis_data.investment_signal.key_catalysts.length > 0 && (
          <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Key Catalysts
            </h4>
            <ul className="space-y-1.5">
              {analysis_data.investment_signal.key_catalysts.slice(0, 3).map((catalyst, idx) => (
                <li key={idx} className="text-sm text-green-800 dark:text-green-200 flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{catalyst}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {analysis_data.investment_signal.key_risks.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4 border border-red-200 dark:border-red-800">
            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Key Risks
            </h4>
            <ul className="space-y-1.5">
              {analysis_data.investment_signal.key_risks.slice(0, 3).map((risk, idx) => (
                <li key={idx} className="text-sm text-red-800 dark:text-red-200 flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
        <span>AI: {model_used.split('/')[1]?.split(':')[0] || model_used}</span>
        <span>•</span>
        <span>Analyzed: {new Date(created_at).toLocaleDateString()}</span>
        <span>•</span>
        <span>Confidence: {confidence}%</span>
      </div>
    </div>
  );
}

interface AnalysisFeedProps {
  filters: FilterState;
}

export function AnalysisFeed({ filters }: AnalysisFeedProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useLatestAnalyses();

  const filteredAnalyses = useMemo(() => {
    const allAnalyses = data?.pages.flatMap(page => page.data).filter(Boolean) ?? [];
    
    return allAnalyses.filter((analysis) => {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = !filters.search || 
        analysis.ticker.toLowerCase().includes(searchLower) ||
        analysis.company_title.toLowerCase().includes(searchLower);

      const matchesRecommendation = filters.recommendation === 'all' || 
        analysis.analysis_data.investment_signal.recommendation === filters.recommendation;

      const matchesSentiment = filters.sentiment === 'all' ||
        analysis.analysis_data.sentiment_analysis.overall_sentiment === filters.sentiment;

      const matchesFilingType = filters.filingType === 'all' ||
        analysis.filing_type === filters.filingType;

      const matchesDateRange = (() => {
        if (filters.dateRange === 'all') return true;
        const analysisDate = new Date(analysis.created_at);
        const now = new Date();
        const daysAgo = {
          '1d': 1,
          '7d': 7,
          '30d': 30,
          '90d': 90,
        }[filters.dateRange] || 0;
        const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        return analysisDate >= cutoffDate;
      })();

      const matchesEventSignificance = filters.eventSignificance === 'all' ||
        analysis.analysis_data.investment_signal.event_significance === filters.eventSignificance;

      const matchesMarketRelevance = filters.marketRelevance === 'all' ||
        analysis.analysis_data.sentiment_analysis.market_relevance === filters.marketRelevance;

      return matchesSearch && matchesRecommendation && matchesSentiment && 
             matchesFilingType && matchesDateRange && matchesEventSignificance && 
             matchesMarketRelevance;
    });
  }, [data, filters]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600 dark:text-gray-400">Loading analyses...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-red-600 dark:text-red-400">Failed to load analyses</div>
      </div>
    );
  }

  if (filteredAnalyses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">No analyses found</p>
        <p className="text-gray-500 dark:text-gray-500 text-sm">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {filteredAnalyses.map((analysis) => (
          <AnalysisCard key={analysis.id} analysis={analysis} />
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center pt-6">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
