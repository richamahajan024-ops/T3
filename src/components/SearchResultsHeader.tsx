/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Calendar, Sparkles, Filter, RefreshCw } from 'lucide-react';
import { Station, TrainType } from '../types/railway';

interface SearchResultsHeaderProps {
  fromStation: Station;
  toStation: Station;
  date?: string;
  trainType: TrainType;
  byCity: boolean;
  totalCount: number;
  filteredCount: number;
  onRefresh: () => void;
  isDemoMode?: boolean;
}

export const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({
  fromStation,
  toStation,
  date,
  trainType,
  byCity,
  totalCount,
  filteredCount,
  onRefresh,
  isDemoMode = true,
}) => {
  // Format friendly date
  const formatFriendlyDate = (d?: string) => {
    if (!d) return null;
    try {
      const [y, m, day] = d.split('-').map(Number);
      return new Date(y, m - 1, day).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return d;
    }
  };

  const friendlyDate = formatFriendlyDate(date);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Main Route Header */}
          <div className="flex items-center gap-2 flex-wrap text-lg md:text-xl font-bold text-slate-900">
            <span>{fromStation.name}</span>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              {fromStation.code}
            </span>
            <ArrowRight className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{toStation.name}</span>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              {toStation.code}
            </span>
          </div>

          {/* Subtitle with count & criteria */}
          <div className="flex items-center gap-2.5 mt-2 text-xs text-slate-500 flex-wrap">
            <span className="font-semibold text-slate-900 bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200/60">
              {filteredCount} {filteredCount === 1 ? 'Direct Train' : 'Direct Trains'} Found
              {filteredCount !== totalCount && ` (filtered from ${totalCount})`}
            </span>

            {friendlyDate && (
              <>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {friendlyDate}
                </span>
              </>
            )}

            {trainType !== 'All Train Types' && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-slate-700 font-medium">
                  Type: {trainType}
                </span>
              </>
            )}

            {byCity && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-sky-700 font-medium">
                  All City Stations Included
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Controls & Demo Mode Badge */}
        <div className="flex items-center gap-3 shrink-0">
          {isDemoMode && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-amber-800" title="Simulated Indian Railways timetable for demonstration">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              DEMO DATA
            </div>
          )}

          <button
            type="button"
            onClick={onRefresh}
            title="Refresh search"
            className="p-2 text-slate-500 hover:text-slate-800 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};
