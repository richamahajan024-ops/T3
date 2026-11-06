/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Globe, Loader2, ExternalLink, RefreshCw, ChevronRight } from 'lucide-react';

interface RouteIntelCardProps {
  fromStation: string;
  toStation: string;
  trainNumber?: string;
  trainName?: string;
}

export const RouteIntelCard: React.FC<RouteIntelCardProps> = ({
  fromStation,
  toStation,
  trainNumber,
  trainName,
}) => {
  const [intel, setIntel] = useState<{
    summary: string;
    sources: Array<{ title: string; uri: string }>;
    isFallback?: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  const fetchRouteIntel = async () => {
    setIsLoading(true);
    setHasRequested(true);
    try {
      const res = await fetch('/api/route-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromStation,
          toStation,
          trainNumber,
          trainName,
        }),
      });
      const data = await res.json();
      setIntel(data);
    } catch (e) {
      console.error(e);
      setIntel({
        summary: `Standard transit corridor between ${fromStation} and ${toStation}.`,
        sources: [],
        isFallback: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 text-white rounded-xl border border-sky-800/80 p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-xs sm:text-sm text-white">
                Live Route Intelligence & Transit Insights
              </h4>
              <span className="flex items-center gap-1 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                <Globe className="w-2.5 h-2.5 text-emerald-400" />
                Google Search Grounded
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Powered by <strong>gemini-3.8-flash</strong> with live Google Search data for {fromStation} → {toStation}
            </p>
          </div>
        </div>

        {!hasRequested && (
          <button
            type="button"
            onClick={fetchRouteIntel}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Analyze with Google Search</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isLoading && (
        <div className="mt-3 pt-3 border-t border-sky-900/80 flex items-center gap-2 text-xs text-sky-200">
          <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
          <span>Retrieving verified route intelligence and recent railway notices via Google Search...</span>
        </div>
      )}

      {!isLoading && intel && (
        <div className="mt-3 pt-3 border-t border-sky-900/80 space-y-2.5 text-xs text-slate-200">
          <div className="leading-relaxed whitespace-pre-wrap text-[11px] sm:text-xs">
            {intel.summary}
          </div>

          {intel.sources && intel.sources.length > 0 && (
            <div className="pt-2 border-t border-sky-900/60 flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Sources:
              </span>
              {intel.sources.map((src, i) => (
                <a
                  key={i}
                  href={src.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-900/80 hover:bg-sky-800 text-sky-200 text-[10px] border border-sky-700/60 transition-colors"
                >
                  <span className="max-w-[150px] truncate">{src.title}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
