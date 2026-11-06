/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Train, Zap, Shield, Sparkles, Clock, Calendar } from 'lucide-react';
import { TRAIN_TYPES } from './TrainTypeFilter';

export const TrainInfoView: React.FC = () => {
  const trainCategories = [
    {
      type: 'Vande Bharat Express',
      speed: 'Up to 160 km/h',
      description: 'Indigenous semi-high-speed trainsets featuring state-of-the-art passenger amenities, onboard Wi-Fi, bio-vacuum toilets, and automatic doors.',
      classes: 'Executive Class (EC), Chair Car (CC)',
      pantry: 'Catering included / opt-out',
    },
    {
      type: 'Rajdhani Express',
      speed: '130 - 140 km/h',
      description: 'Premier air-conditioned express connecting national capital New Delhi with various state capitals across the country.',
      classes: '1st AC (1A), 2nd AC (2A), 3rd AC (3A)',
      pantry: 'Full onboard catering',
    },
    {
      type: 'Shatabdi Express',
      speed: '130 - 150 km/h',
      description: 'Day-train premium air-conditioned express connecting major metropolitan cities with return journeys on the same day.',
      classes: 'Executive Class (EC), AC Chair Car (CC)',
      pantry: 'Complimentary meals and snacks',
    },
    {
      type: 'Duronto Express',
      speed: '120 - 130 km/h',
      description: 'Point-to-point non-stop or limited-stop long-distance express trains connecting metropolitan hubs.',
      classes: '1A, 2A, 3A, Sleeper (SL)',
      pantry: 'Dedicated onboard pantry car',
    },
    {
      type: 'Garib Rath Express',
      speed: '110 - 130 km/h',
      description: 'Subsidized air-conditioned long-distance trains designed to provide affordable AC travel to the general public.',
      classes: '3rd AC Economy, AC Chair Car',
      pantry: 'Bedroll & snacks on demand',
    },
    {
      type: 'Superfast Express',
      speed: '55 - 110 km/h avg',
      description: 'High-priority trains operating with higher average speed and fewer intermediate stops than ordinary express services.',
      classes: 'AC classes, Sleeper, General',
      pantry: 'Pantry car or catering at halts',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Train className="w-5 h-5 text-amber-600" />
          Indian Railways Train Classification Guide
        </h2>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          RailConnect indexes direct services across all major Indian Railways train categories. Here is an overview of operating classes, speeds, and amenities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trainCategories.map((cat) => (
          <div
            key={cat.type}
            className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">{cat.type}</h3>
                <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                  {cat.speed}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {cat.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block font-medium">Coach Classes:</span>
                <span className="font-semibold text-slate-800">{cat.classes}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Catering:</span>
                <span className="font-semibold text-slate-800">{cat.pantry}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Timetable & Overnight Rules Guide */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-sky-700" />
          Understanding RailConnect Timetables & Overnight Indicators
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-900 block mb-1">Overnight Journey (+1 Day)</span>
            When a train departs on day 1 and reaches its destination on the subsequent calendar day, a visible badge (+1 day) is rendered beside the arrival timestamp.
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-900 block mb-1">Weekly Running Days</span>
            Indian Railways trains frequently run on specific weekly frequencies (e.g. daily, tri-weekly, or 6 days/week). Green indicators display active departure days.
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-900 block mb-1">Metropolitan Clustering (byCity)</span>
            Selecting byCity searches all regional terminals within an urban center (such as NDLS, NZM, DLI, and ANVT for the Delhi Capital Region).
          </div>
        </div>
      </div>
    </div>
  );
};
