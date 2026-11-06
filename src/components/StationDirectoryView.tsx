/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, MapPin, ArrowRight, Check } from 'lucide-react';
import { MOCK_STATIONS } from '../data/mockStations';
import { Station } from '../types/railway';

interface StationDirectoryViewProps {
  onSetStation: (station: Station, type: 'from' | 'to') => void;
}

export const StationDirectoryView: React.FC<StationDirectoryViewProps> = ({
  onSetStation,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('ALL');

  const activeStations = MOCK_STATIONS.filter((s) => s.isActive);

  const zones = Array.from(
    new Set(activeStations.map((s) => s.zone).filter(Boolean))
  ) as string[];

  const filteredStations = activeStations.filter((st) => {
    const q = filterQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      st.code.toLowerCase().includes(q) ||
      st.name.toLowerCase().includes(q) ||
      st.city.toLowerCase().includes(q) ||
      st.state.toLowerCase().includes(q);

    const matchesZone = selectedZone === 'ALL' || st.zone === selectedZone;

    return matchesQuery && matchesZone;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-600" />
          Indian Railways Major Station Directory
        </h2>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          Browse verified Indian railway station codes, cities, and administrative zones. Click any station to select it as your departure or destination station.
        </p>

        {/* Filter Toolbar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search by station code (e.g. NDLS), name, city, or state..."
              className="w-full pl-9 pr-4 py-2 text-xs font-medium rounded-lg border border-slate-200 focus:outline-none focus:border-sky-700 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-medium">Zone:</span>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="py-2 px-3 text-xs font-medium rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-sky-700"
            >
              <option value="ALL">All Zones ({activeStations.length})</option>
              {zones.map((z) => (
                <option key={z} value={z}>
                  {z} Zone
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredStations.map((st) => (
          <div
            key={st.code}
            className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-sm hover:border-sky-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-200">
                  {st.code}
                </span>
                {st.zone && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-sky-50 text-sky-800">
                    {st.zone} Zone
                  </span>
                )}
              </div>
              <h3 className="font-bold text-sm text-slate-900 mt-2">
                {st.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {st.city}, {st.state}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSetStation(st, 'from')}
                className="flex-1 py-1.5 px-2 rounded bg-slate-50 hover:bg-sky-50 hover:text-sky-900 text-[11px] font-semibold text-slate-700 border border-slate-200 transition-colors"
              >
                Set as Departure
              </button>
              <button
                type="button"
                onClick={() => onSetStation(st, 'to')}
                className="flex-1 py-1.5 px-2 rounded bg-slate-50 hover:bg-amber-50 hover:text-amber-900 text-[11px] font-semibold text-slate-700 border border-slate-200 transition-colors"
              >
                Set as Destination
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
