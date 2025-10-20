'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Search } from 'lucide-react';

export default function ScreenerPage() {
  const [filters, setFilters] = useState({
    minConfidence: 50,
    maxConfidence: 100,
    sector: 'all',
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Stock Screener
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Filter and discover companies based on AI analysis metrics
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Confidence Score
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.minConfidence}
                onChange={(e) => setFilters({ ...filters, minConfidence: Number(e.target.value) })}
                className="w-full"
              />
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {filters.minConfidence}%
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Confidence Score
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.maxConfidence}
                onChange={(e) => setFilters({ ...filters, maxConfidence: Number(e.target.value) })}
                className="w-full"
              />
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {filters.maxConfidence}%
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sector
              </label>
              <select
                value={filters.sector}
                onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option value="all">All Sectors</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Financial Services</option>
                <option value="consumer">Consumer</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Advanced Screening Coming Soon
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Filter companies by sentiment trends, confidence scores, and more
          </p>
        </div>
      </main>
    </div>
  );
}
