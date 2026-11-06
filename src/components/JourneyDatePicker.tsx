/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, X, CalendarDays } from 'lucide-react';

interface JourneyDatePickerProps {
  value: string; // YYYY-MM-DD or ''
  onChange: (date: string) => void;
  error?: string;
}

export const JourneyDatePicker: React.FC<JourneyDatePickerProps> = ({
  value,
  onChange,
  error,
}) => {
  // Get today in YYYY-MM-DD
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Tomorrow string
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Format friendly display
  const getFriendlyDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      return dt.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor="journey-date" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          Journey Date <span className="text-slate-400 font-normal lowercase">(optional)</span>
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[11px] font-medium text-amber-700 hover:text-amber-800 flex items-center gap-0.5"
          >
            <X className="w-3 h-3" />
            Clear Date
          </button>
        )}
      </div>

      <div
        className={`relative flex items-center bg-white rounded-lg border transition-all ${
          error
            ? 'border-red-400 ring-2 ring-red-100'
            : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <div className="pl-3.5 pr-2 text-slate-400">
          <Calendar className="w-5 h-5 text-slate-500" />
        </div>

        <input
          id="journey-date"
          type="date"
          min={todayStr}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full py-2.5 pr-3 text-sm font-medium text-slate-900 focus:outline-none bg-transparent cursor-pointer"
        />
      </div>

      {/* Friendly date display & quick select */}
      <div className="mt-1.5 flex items-center justify-between text-xs">
        {value ? (
          <span className="font-semibold text-sky-800 flex items-center gap-1">
            <CalendarDays className="w-3.5 h-3.5 text-sky-700" />
            {getFriendlyDate(value)}
          </span>
        ) : (
          <span className="text-slate-400 text-[11px]">All operating schedules</span>
        )}

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onChange(todayStr)}
            className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
              value === todayStr
                ? 'bg-sky-100 text-sky-900 font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => onChange(tomorrowStr)}
            className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
              value === tomorrowStr
                ? 'bg-sky-100 text-sky-900 font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tomorrow
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
          <span className="inline-block w-1 h-1 rounded-full bg-red-600"></span>
          {error}
        </p>
      )}
    </div>
  );
};
