/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Train, CheckCircle2, ShieldCheck, AlertCircle, FileText, Database } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-amber-500 text-sky-950 flex items-center justify-center font-bold">
            <Train className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              RailConnect – Complete Train Search
            </h2>
            <p className="text-xs text-slate-500">
              Business Requirement Document: T3-06 – Complete Train Search
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-4 leading-relaxed">
          RailConnect is a modern, high-performance web prototype engineered to provide seamless discovery and timetable comparison of direct train services across the Indian Railways network.
        </p>
      </div>

      {/* Scope & Boundary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            In-Scope Capabilities
          </h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Departure & destination autocomplete with station code mapping.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Direct trains search with departure, arrival, duration, and distance.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Operating days visualization (Mon-Sun) with Daily indicator.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Overnight journey detection (+1 day / +2 days).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Metropolitan clustering via byCity parameter.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Multi-criteria sorting (departure, duration, distance, name) and instant filtering.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Explicit Out-of-Scope Notice
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Per the specified project requirements (Section 1), this application is exclusively dedicated to <strong>train timetable discovery</strong>.
          </p>
          <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
            Live seat availability, ticket reservation, and fare calculation are deliberately excluded as they operate outside the scope of the RailRadar Train Search API.
          </div>
        </div>
      </div>

      {/* Architecture & API Mapping */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-sky-700" />
          Technical Specifications & API Endpoints
        </h3>
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="font-mono font-semibold text-slate-900">
              GET /v1/lookup/search/stations?q=&#123;query&#125;&limit=10&lang=en
            </div>
            <div className="text-slate-500 mt-1">
              Debounced by 300ms, min 2 characters, sorted by popularity descending, caches responses for 5 minutes.
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="font-mono font-semibold text-slate-900">
              GET /v1/trains/between/&#123;from&#125;/&#123;to&#125;?date=YYYY-MM-DD&type=...&byCity=...
            </div>
            <div className="text-slate-500 mt-1">
              Path parameters with validated station codes. Handles byCity metropolitan expansion, weekday calculation, and string-preserved train numbers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
