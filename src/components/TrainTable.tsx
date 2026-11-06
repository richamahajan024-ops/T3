/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Utensils,
  ArrowRight,
  Info,
} from 'lucide-react';
import { TrainItem } from '../types/railway';
import { formatDuration, getOvernightDays } from '../services/railRadarService';
import { RunningDays } from './RunningDays';

interface TrainTableProps {
  trains: TrainItem[];
}

export const TrainTable: React.FC<TrainTableProps> = ({ trains }) => {
  const [expandedTrainNumber, setExpandedTrainNumber] = useState<string | null>(null);

  const toggleExpand = (trainNumber: string) => {
    setExpandedTrainNumber((prev) => (prev === trainNumber ? null : trainNumber));
  };

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
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="py-3 px-4">Train No. & Name</th>
              <th className="py-3 px-4">Departure</th>
              <th className="py-3 px-4 text-center">Duration</th>
              <th className="py-3 px-4">Arrival</th>
              <th className="py-3 px-4 text-right">Distance</th>
              <th className="py-3 px-4">Runs On</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-3 text-center">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {trains.map((t) => {
              const overnightDays = getOvernightDays(t);
              const isExpanded = expandedTrainNumber === t.train.number;

              return (
                <React.Fragment key={t.train.number}>
                  <tr
                    onClick={() => toggleExpand(t.train.number)}
                    className={`hover:bg-sky-50/40 transition-colors cursor-pointer ${
                      isExpanded ? 'bg-sky-50/60' : ''
                    }`}
                  >
                    {/* Train Number & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-sky-950 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 tracking-wider tabular-nums">
                          {t.train.number}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-900 leading-tight">
                            {t.train.name}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                            {t.train.pantry && (
                              <span className="flex items-center gap-0.5 text-amber-700 font-medium">
                                <Utensils className="w-3 h-3" /> Pantry Available
                              </span>
                            )}
                            {t.train.classes && (
                              <span className="text-slate-400 font-mono text-[10px]">
                                {t.train.classes.join(' · ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Departure */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                        {t.from.departure}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                        <span className="font-mono font-semibold text-slate-700">{t.from.code}</span>
                        {t.from.platform && (
                          <span className="text-slate-400 text-[10px]">PF {t.from.platform}</span>
                        )}
                      </div>
                    </td>

                    {/* Duration & Halts */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="font-mono text-xs font-semibold text-slate-800 tabular-nums">
                        {formatDuration(t.duration)}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {t.totalHaltsBetween > 0
                          ? `${t.totalHaltsBetween} halts`
                          : 'Non-stop'}
                      </div>
                    </td>

                    {/* Arrival */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                          {t.to.arrival}
                        </span>
                        {overnightDays > 0 && (
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                            +{overnightDays} {overnightDays === 1 ? 'day' : 'days'}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                        <span className="font-mono font-semibold text-slate-700">{t.to.code}</span>
                        {t.to.platform && (
                          <span className="text-slate-400 text-[10px]">PF {t.to.platform}</span>
                        )}
                      </div>
                    </td>

                    {/* Distance */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="font-mono text-xs font-semibold text-slate-800 tabular-nums">
                        {t.distance ? `${t.distance.toLocaleString('en-IN')} km` : 'Not available'}
                      </span>
                    </td>

                    {/* Runs On */}
                    <td className="py-3.5 px-4">
                      <RunningDays runDays={t.train.runDays} compact />
                    </td>

                    {/* Train Type */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getTrainTypeBadgeStyle(
                          t.train.type
                        )}`}
                      >
                        {t.train.type}
                      </span>
                    </td>

                    {/* Expand Action */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        aria-label={`View schedule and intermediate stops for train ${t.train.number}`}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Route Details Row */}
                  {isExpanded && (
                    <tr className="bg-slate-50/80">
                      <td colSpan={8} className="p-4 border-t border-b border-slate-200">
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-800">
                                Route & Intermediate Halts
                              </span>
                              <span className="text-slate-400 text-xs">·</span>
                              <span className="text-xs text-slate-600">
                                {t.from.name} ({t.from.code}) to {t.to.name} ({t.to.code})
                              </span>
                            </div>
                            {t.remarks && (
                              <div className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                {t.remarks}
                              </div>
                            )}
                          </div>

                          {t.halts && t.halts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                              {t.halts.map((halt, idx) => (
                                <div
                                  key={idx}
                                  className="p-2 bg-white rounded border border-slate-200 text-[11px]"
                                >
                                  <div className="flex items-center justify-between font-semibold text-slate-800">
                                    <span>{halt.stationName}</span>
                                    <span className="font-mono text-[10px] text-slate-500">
                                      {halt.stationCode}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between mt-1 text-slate-500 font-mono text-[10px]">
                                    <span>
                                      Arr: {halt.arrival} · Dep: {halt.departure}
                                    </span>
                                    {halt.haltMinutes > 0 && (
                                      <span className="text-amber-700 font-semibold">
                                        {halt.haltMinutes}m halt
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">
                                    {halt.distanceKm} km · Day {halt.day}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-slate-500 italic py-1">
                              Intermediate halt timetables are available via RailRadar route explorer. Total intermediate stations: {t.totalHaltsBetween}.
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
