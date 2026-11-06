/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ArrowDownUp,
  Search,
  LayoutGrid,
  Table as TableIcon,
  X,
  Filter,
} from 'lucide-react';
import { SortField, SortOrder, TrainType, ViewMode } from '../types/railway';
import { TRAIN_TYPES } from './TrainTypeFilter';

interface FilterSortToolbarProps {
  sortBy: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
  trainTypeFilter: TrainType;
  onTrainTypeChange: (type: TrainType) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  availableTypes: TrainType[];
}

export const FilterSortToolbar: React.FC<FilterSortToolbarProps> = ({
  sortBy,
  sortOrder,
  onSortChange,
  trainTypeFilter,
  onTrainTypeChange,
  searchQuery,
  onSearchQueryChange,
  viewMode,
  onViewModeChange,
  availableTypes,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
      {/* Left zone: Search within results & Type filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
        {/* Instant Search in Results */}
        <div className="relative min-w-[200px] flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search train name or number..."
            className="w-full pl-8 pr-7 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-700 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchQueryChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter by Train Type dropdown */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={trainTypeFilter}
            onChange={(e) => onTrainTypeChange(e.target.value as TrainType)}
            className="py-2 px-2.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:border-sky-700 cursor-pointer"
          >
            <option value="All Train Types">All Train Types ({availableTypes.length})</option>
            {TRAIN_TYPES.filter((t) => t !== 'All Train Types').map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right zone: Sort By & View Mode toggle */}
      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
        {/* Sort By Dropdown */}
        <div className="flex items-center gap-1.5">
          <ArrowDownUp className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium hidden sm:inline">Sort:</span>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [f, o] = e.target.value.split('-') as [SortField, SortOrder];
              onSortChange(f, o);
            }}
            className="py-2 px-2.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:border-sky-700 cursor-pointer"
          >
            <option value="departure-asc">Departure (Earliest First)</option>
            <option value="departure-desc">Departure (Latest First)</option>
            <option value="duration-asc">Duration (Fastest First)</option>
            <option value="distance-asc">Distance (Shortest First)</option>
            <option value="name-asc">Train Name (A to Z)</option>
          </select>
        </div>

        {/* View Mode Toggle (Segmented control) */}
        <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            title="Table View"
            aria-label="Table View"
            className={`p-1.5 rounded-md transition-all flex items-center gap-1 font-medium ${
              viewMode === 'table'
                ? 'bg-white text-sky-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span className="hidden xl:inline">Table</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('card')}
            title="Card View"
            aria-label="Card View"
            className={`p-1.5 rounded-md transition-all flex items-center gap-1 font-medium ${
              viewMode === 'card'
                ? 'bg-white text-sky-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden xl:inline">Cards</span>
          </button>
        </div>
      </div>
    </div>
  );
};
