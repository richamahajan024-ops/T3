/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TrainTrack } from 'lucide-react';
import { TrainType } from '../types/railway';

interface TrainTypeFilterProps {
  value: TrainType;
  onChange: (type: TrainType) => void;
}

export const TRAIN_TYPES: TrainType[] = [
  'All Train Types',
  'Vande Bharat',
  'Rajdhani',
  'Shatabdi',
  'Duronto',
  'Garib Rath',
  'Superfast',
  'Express',
  'Passenger',
  'Local',
  'Special',
];

export const TrainTypeFilter: React.FC<TrainTypeFilterProps> = ({ value, onChange }) => {
  return (
    <div className="w-full">
      <label htmlFor="train-type" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
        Train Type
      </label>

      <div className="relative flex items-center bg-white rounded-lg border border-slate-300 hover:border-slate-400 transition-colors">
        <div className="pl-3.5 pr-2 text-slate-400">
          <TrainTrack className="w-5 h-5 text-slate-500" />
        </div>

        <select
          id="train-type"
          value={value}
          onChange={(e) => onChange(e.target.value as TrainType)}
          className="w-full py-2.5 pr-8 text-sm font-medium text-slate-900 bg-transparent focus:outline-none cursor-pointer appearance-none"
        >
          {TRAIN_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute right-3 text-slate-400 text-xs">
          ▼
        </div>
      </div>
      <p className="mt-1.5 text-[11px] text-slate-400">
        Filter by official Indian Railways train class
      </p>
    </div>
  );
};
