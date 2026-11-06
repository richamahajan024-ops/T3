/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WeekDay } from '../types/railway';

interface RunningDaysProps {
  runDays: WeekDay[];
  compact?: boolean;
}

const ALL_DAYS: WeekDay[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const RunningDays: React.FC<RunningDaysProps> = ({ runDays, compact = false }) => {
  const isDaily = runDays.length === 7;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        {ALL_DAYS.map((day) => {
          const isActive = runDays.includes(day);
          return (
            <span
              key={day}
              title={`${day}: ${isActive ? 'Runs' : 'Does not run'}`}
              className={`inline-flex items-center justify-center font-mono font-semibold transition-colors ${
                compact
                  ? 'w-5 h-5 text-[10px] rounded'
                  : 'w-6 h-6 text-xs rounded-md'
              } ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-300'
              }`}
            >
              {day[0]}
            </span>
          );
        })}
      </div>
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
        {isDaily ? (
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
            Daily Service
          </span>
        ) : (
          <span>{runDays.length} days / week</span>
        )}
      </div>
    </div>
  );
};
