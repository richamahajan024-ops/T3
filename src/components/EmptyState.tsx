/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  TrainTrack,
  CalendarX,
  ArrowLeftRight,
  Building2,
  Compass,
  RotateCcw,
} from 'lucide-react';
import { Station, TrainType } from '../types/railway';

interface EmptyStateProps {
  fromStation: Station;
  toStation: Station;
  date?: string;
  trainType: TrainType;
  byCity: boolean;
  onClearDate: () => void;
  onToggleByCity: () => void;
  onSwapStations: () => void;
  onResetFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  fromStation,
  toStation,
  date,
  trainType,
  byCity,
  onClearDate,
  onToggleByCity,
  onSwapStations,
  onResetFilters,
}) => {
  const isDateFiltered = Boolean(date);
  const isTypeFiltered = trainType !== 'All Train Types';

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-8 md:p-12 text-center shadow-xs max-w-2xl mx-auto">
      <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
        {isDateFiltered ? (
          <CalendarX className="w-7 h-7 text-amber-600" />
        ) : (
          <TrainTrack className="w-7 h-7 text-slate-600" />
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-900">
        {isDateFiltered
          ? `No trains run on ${date}`
          : `No direct trains found between ${fromStation.name} and ${toStation.name}`}
      </h3>

      <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
        {isDateFiltered
          ? 'Trains may operate on other days of the week, or the selected train type does not have scheduled departures on this date.'
          : `There are currently no scheduled direct passenger services connecting ${fromStation.code} directly to ${toStation.code}.`}
      </p>

      {/* Helpful Recovery Suggestions */}
      <div className="mt-6 pt-5 border-t border-slate-100 text-left">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3 text-center">
          Suggested Actions:
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Action 1: Clear date */}
          {isDateFiltered && (
            <button
              type="button"
              onClick={onClearDate}
              className="p-3 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-left transition-all flex items-start gap-2.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-slate-800">Clear Journey Date</div>
                <div className="text-[11px] text-slate-500">View all weekly operating days</div>
              </div>
            </button>
          )}

          {/* Action 2: Enable byCity if currently off */}
          {!byCity && (
            <button
              type="button"
              onClick={onToggleByCity}
              className="p-3 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-left transition-all flex items-start gap-2.5 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-slate-800">Include All City Stations</div>
                <div className="text-[11px] text-slate-500">Search across regional metro terminals</div>
              </div>
            </button>
          )}

          {/* Action 3: Swap Stations */}
          <button
            type="button"
            onClick={onSwapStations}
            className="p-3 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-left transition-all flex items-start gap-2.5 cursor-pointer"
          >
            <ArrowLeftRight className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-slate-800">Check Reverse Direction</div>
              <div className="text-[11px] text-slate-500">
                {toStation.code} → {fromStation.code}
              </div>
            </div>
          </button>

          {/* Action 4: Reset all filters */}
          {isTypeFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="p-3 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-left transition-all flex items-start gap-2.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-slate-800">Show All Train Types</div>
                <div className="text-[11px] text-slate-500">Clear train type restriction</div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
