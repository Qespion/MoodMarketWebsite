'use client';

import { useState } from 'react';
import { Search, Filter, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterState = {
  search: string;
  recommendation: 'all' | 'buy' | 'hold' | 'sell';
  sentiment: 'all' | 'positive' | 'neutral' | 'negative';
  filingType: 'all' | '10-K' | '10-Q' | '8-K' | '6-K' | '20-F' | 'S-1';
  dateRange: 'all' | '1d' | '7d' | '30d' | '90d';
  eventSignificance: 'all' | 'minor' | 'moderate' | 'major';
  marketRelevance: 'all' | 'low' | 'medium' | 'high';
};

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company name or ticker..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="h-5 w-5" />
            Filters
          </button>

          <div className={cn(
            'flex flex-col lg:flex-row gap-3 flex-wrap',
            showFilters ? 'flex' : 'hidden lg:flex'
          )}>
            <select
              value={filters.recommendation}
              onChange={(e) => updateFilter('recommendation', e.target.value as FilterState['recommendation'])}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Recommendations</option>
              <option value="buy">Buy</option>
              <option value="hold">Hold</option>
              <option value="sell">Sell</option>
            </select>

            <select
              value={filters.eventSignificance}
              onChange={(e) => updateFilter('eventSignificance', e.target.value as FilterState['eventSignificance'])}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Significance</option>
              <option value="major">Major</option>
              <option value="moderate">Moderate</option>
              <option value="minor">Minor</option>
            </select>

            <select
              value={filters.marketRelevance}
              onChange={(e) => updateFilter('marketRelevance', e.target.value as FilterState['marketRelevance'])}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Market Relevance</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filters.sentiment}
              onChange={(e) => updateFilter('sentiment', e.target.value as FilterState['sentiment'])}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>

            <select
              value={filters.filingType}
              onChange={(e) => updateFilter('filingType', e.target.value as FilterState['filingType'])}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Filing Types</option>
              <option value="10-K">10-K (Annual)</option>
              <option value="10-Q">10-Q (Quarterly)</option>
              <option value="8-K">8-K (Current)</option>
              <option value="6-K">6-K (Foreign)</option>
              <option value="20-F">20-F (Foreign Annual)</option>
              <option value="S-1">S-1 (IPO)</option>
            </select>

            <select
              value={filters.dateRange}
              onChange={(e) => updateFilter('dateRange', e.target.value as FilterState['dateRange'])}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { FilterState };
