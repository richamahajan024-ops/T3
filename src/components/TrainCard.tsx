/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Utensils,
  TrainTrack,
} from 'lucide-react';
import { TrainItem } from '../types/railway';
import { formatDuration, getOvernightDays } from '../services/railRadarService';
import { RunningDays } from './RunningDays';

interface TrainCardProps {
  train: TrainItem;
}

export const TrainCard: React.FC<TrainCardProps> = ({ train: t }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const overnightDays = getOvernightDays(t);

  const getTrainTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'Vande Bharat':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Rajdhani':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'Shatabdi':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Duronto':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Garib Rath':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Superfast':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden">
      {/* Top Header: Train Number, Name, Badges */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50/50">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-mono text-xs font-bold text-sky-950 px-2 py-0.5 rounded bg-white border border-slate-200 tracking-wider tabular-nums shadow-2xs">
            {t.train.number}
          </span>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            {t.train.name}
          </h3>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getTrainTypeBadgeStyle(
              t.train.type
            )}`}
          >
            {t.train.type}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          {t.train.pantry && (
            <span className="flex items-center gap-1 text-amber-700 font-medium text-[11px]">
              <Utensils className="w-3.5 h-3.5" /> Pantry Available
            </span>
          )}
          {t.train.classes && (
            <span className="font-mono text-[11px] text-slate-400">
              {t.train.classes.join(' · ')}
            </span>
          )}
        </div>
      </div>

      {/* Main Timetable Matrix */}
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-4 items-center">
          {/* Departure Column */}
          <div className="text-left">
            <div className="font-mono text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
              {t.from.departure}
            </div>
            <div className="text-xs font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
              <span>{t.from.name}</span>
              <span className="font-mono text-slate-500 text-[11px]">({t.from.code})</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Day {t.from.day} {t.from.platform && `· Platform ${t.from.platform}`}
            </div>
          </div>

          {/* Center Timeline Visual */}
          <div className="flex flex-col items-center justify-center py-2 px-2">
            <span className="font-mono text-xs font-bold text-slate-700 tabular-nums">
              {formatDuration(t.duration)}
            </span>
            <div className="w-32 sm:w-40 relative flex items-center my-1.5">
              <div className="w-2 h-2 rounded-full border-2 border-sky-700 bg-white z-10"></div>
              <div className="flex-1 h-0.5 bg-slate-300"></div>
              <div className="w-2 h-2 rounded-full bg-sky-700 z-10"></div>
            </div>
            <span className="text-[11px] text-slate-500">
              {t.totalHaltsBetween > 0 ? `${t.totalHaltsBetween} halts` : 'Non-stop'}
            </span>
          </div>

          {/* Arrival Column */}
          <div className="text-left sm:text-right">
            <div className="flex items-center sm:justify-end gap-2">
              <span className="font-mono text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
                {t.to.arrival}
              </span>
              {overnightDays > 0 && (
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                  +{overnightDays} {overnightDays === 1 ? 'day' : 'days'}
                </span>
              )}
            </div>
            <div className="text-xs font-semibold text-slate-800 mt-0.5 flex items-center sm:justify-end gap-1">
              <span>{t.to.name}</span>
              <span className="font-mono text-slate-500 text-[11px]">({t.to.code})</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Day {t.to.day} {t.to.platform && `· Platform ${t.to.platform}`}
            </div>
          </div>
        </div>

        {/* Bottom Strip: Operating Days & Distance & Halt trigger */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Running Days */}
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Runs On
            </span>
            <RunningDays runDays={t.train.runDays} />
          </div>

          {/* Distance & Halts Expand Button */}
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="text-right">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Distance
              </span>
              <span className="font-mono text-xs font-bold text-slate-800 tabular-nums">
                {t.distance ? `${t.distance.toLocaleString('en-IN')} km` : 'Not available'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isExpanded ? 'Hide Route' : 'View Halts'}</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Halt details drawer */}
        {isExpanded && (
          <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/70 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">
                Intermediate Schedule ({t.from.code} → {t.to.code})
              </span>
              <span className="text-[11px] text-slate-500">
                Total Halts: {t.totalHaltsBetween}
              </span>
            </div>

            {t.halts && t.halts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {t.halts.map((halt, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>{halt.stationName}</span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {halt.stationCode}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[11px] text-slate-600 font-mono">
                      <span>Arr: {halt.arrival}</span>
                      <span>Dep: {halt.departure}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                      <span>{halt.distanceKm} km · Day {halt.day}</span>
                      {halt.haltMinutes > 0 && (
                        <span className="text-amber-700 font-semibold font-mono">
                          {halt.haltMinutes} min stop
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Direct train service with {t.totalHaltsBetween} intermediate operational stops.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
