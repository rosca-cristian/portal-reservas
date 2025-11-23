/**
 * FilterSummary Component - Display active filters and result count
 * Story 2.4: Search Bar with Quick Filters
 */

import { X } from 'lucide-react';

interface FilterSummaryProps {
  resultCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
  onClearAll: () => void;
}

export function FilterSummary({
  resultCount,
  totalCount,
  hasActiveFilters,
  onClearAll,
}: FilterSummaryProps) {
  const resultText =
    resultCount === 0
      ? 'No spaces found'
      : `${resultCount} ${resultCount === 1 ? 'space' : 'spaces'} found`;

  return (
    <div className="filter-summary flex items-center justify-between glassmorphism px-4 py-3 rounded-lg">
      {/* Screen reader announcement */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {resultText}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700" aria-hidden="true">
          {resultCount === 0 ? (
            <span className="font-medium">No spaces found</span>
          ) : (
            <>
              <span className="font-semibold">{resultCount}</span>{' '}
              {resultCount === 1 ? 'space' : 'spaces'} found
              {hasActiveFilters && totalCount !== resultCount && (
                <span className="text-gray-500 ml-1">
                  (of {totalCount} total)
                </span>
              )}
            </>
          )}
        </span>
      </div>

      {hasActiveFilters && (
        <button
          onClick={onClearAll}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-white/40 rounded-md transition-colors"
          aria-label="Clear all active filters"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Clear all filters
        </button>
      )}
    </div>
  );
}
