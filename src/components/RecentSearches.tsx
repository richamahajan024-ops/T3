/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { History, ArrowRight, Trash2, Compass, Sparkles } from 'lucide-react';
import { SearchHistoryItem, Station, TrainType } from '../types/railway';
import { MOCK_STATIONS } from '../data/mockStations';

interface RecentSearchesProps {
  history: SearchHistoryItem[];
  onSelectHistory: (item: SearchHistoryItem) => void;
  onClearHistory: () => void;
  onSelectQuickRoute: (fromCode: string, toCode: string) => void;
}

// Curated popular Indian Railways test corridors matching specification section 7
const POPULAR_ROUTES = [
  { fromCode: 'NDLS', toCode: 'MMCT', label: 'Delhi ⇄ Mumbai', description: 'Rajdhani & Tejas Route' },
  { fromCode: 'NDLS', toCode: 'JP', label: 'Delhi ⇄ Jaipur', description: 'Vande Bharat & Shatabdi' },
  { fromCode: 'CSMT', toCode: 'PUNE', label: 'Mumbai ⇄ Pune', description: 'Deccan Queen & Intercity' },
  { fromCode: 'MAS', toCode: 'SBC', label: 'Chennai ⇄ Bengaluru', description: 'Vande Bharat & Shatabdi' },
  { fromCode: 'HWH', toCode: 'NDLS', label: 'Kolkata ⇄ Delhi', description: 'Rajdhani & Duronto' },
  { fromCode: 'HYB', toCode: 'CSMT', label: 'Hyderabad ⇄ Mumbai', description: 'Hussain Sagar & Duronto' },
];

export const RecentSearches: React.FC<RecentSearchesProps> = ({
  history,
  onSelectHistory,
  onClearHistory,
  onSelectQuickRoute,
}) => {
  return (
    <div className="space-y-4">
      {/* Popular Direct Corridors for 1-Click Evaluation */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          <Compass className="w-4 h-4 text-amber-600" />
          <span>Popular Railway Routes (1-Click Search)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {POPULAR_ROUTES.map((route) => (
            <button
              key={`${route.fromCode}-${route.toCode}`}
              type="button"
              onClick={() => onSelectQuickRoute(route.fromCode, route.toCode)}
              className="p-2.5 rounded-lg border border-slate-200 hover:border-amber-300 bg-slate-50 hover:bg-amber-50/50 transition-all text-left cursor-pointer group"
            >
              <div className="text-xs font-bold text-slate-800 group-hover:text-amber-800 flex items-center justify-between">
                <span>{route.fromCode}</span>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-amber-600" />
                <span>{route.toCode}</span>
              </div>
              <div className="text-[11px] font-medium text-slate-600 mt-1 truncate">
                {route.label}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {route.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* User's Recent Searches */}
      {history.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <History className="w-4 h-4 text-sky-700" />
              <span>Recent Searches ({history.length})</span>
            </div>
            <button
              type="button"
              onClick={onClearHistory}
              className="text-xs text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectHistory(item)}
                className="shrink-0 px-3 py-2 rounded-lg border border-slate-200 hover:border-sky-300 bg-slate-50 hover:bg-sky-50 transition-all text-left flex items-center gap-2.5 cursor-pointer"
              >
                <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="font-mono">{item.fromStation.code}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="font-mono">{item.toStation.code}</span>
                </div>
                {item.date && (
                  <span className="text-[10px] text-slate-500 font-mono">
                    {item.date}
                  </span>
                )}
                {item.byCity && (
                  <span className="text-[9px] font-medium px-1 rounded bg-sky-100 text-sky-800">
                    City
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
