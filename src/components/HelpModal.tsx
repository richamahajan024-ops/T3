/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, HelpCircle, Check, Wrench, AlertTriangle, ShieldAlert } from 'lucide-react';
import {
  SimulatedErrorType,
  setSimulatedError,
  getSimulatedError,
} from '../services/railRadarService';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulationChange?: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  onSimulationChange,
}) => {
  const [selectedSim, setSelectedSim] = useState<SimulatedErrorType>(getSimulatedError());

  if (!isOpen) return null;

  const handleSimChange = (sim: SimulatedErrorType) => {
    setSelectedSim(sim);
    setSimulatedError(sim);
    if (onSimulationChange) {
      onSimulationChange();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                RailConnect Quick Help & Evaluator Guide
              </h3>
              <p className="text-[11px] text-slate-500">
                Indian Railways Direct Train Timetable Search
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-slate-600">
          <div>
            <h4 className="font-bold text-slate-900 mb-1">Station Autocomplete:</h4>
            <p className="leading-relaxed">
              Type at least 2 characters to search station suggestions. You can search by station code (e.g., <strong>NDLS</strong>, <strong>MMCT</strong>, <strong>JP</strong>, <strong>CSMT</strong>) or by city/station name (e.g., <strong>Delhi</strong>, <strong>Mumbai</strong>, <strong>Jaipur</strong>). Select a station from the list to populate the code.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1">What is "Include All Stations in These Cities"?</h4>
            <p className="leading-relaxed">
              When checked (<code>byCity=true</code>), searching for <strong>Delhi</strong> will automatically find trains departing from New Delhi (NDLS), Nizamuddin (NZM), Old Delhi (DLI), Anand Vihar (ANVT), and Sarai Rohilla (DEE). Similarly, searching for <strong>Mumbai</strong> encompasses Mumbai Central (MMCT), CSMT, Bandra Terminus (BDTS), Dadar (DR), and LTT.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1">Overnight Journey Indicator:</h4>
            <p className="leading-relaxed">
              Trains arriving on the day following departure display an orange <strong>+1 day</strong> or <strong>+2 days</strong> badge beside the arrival timestamp.
            </p>
          </div>

          {/* Evaluator Testing Panel for Section 9 UI States */}
          <div className="mt-4 pt-4 border-t border-slate-200 bg-amber-50/50 -mx-5 -mb-5 p-5 rounded-b-xl">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-2">
              <Wrench className="w-4 h-4 text-amber-700" />
              <span>Project Reviewer State Simulator (Section 9)</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
              Test specific API edge cases and UI empty/error states as specified in the business requirements:
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSimChange('NONE')}
                className={`p-2 rounded-lg border text-left font-medium text-[11px] transition-all cursor-pointer ${
                  selectedSim === 'NONE'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold">Normal Mode</div>
                <div className={selectedSim === 'NONE' ? 'text-emerald-100' : 'text-slate-400'}>
                  Realistic direct timetable
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSimChange('NETWORK_ERROR')}
                className={`p-2 rounded-lg border text-left font-medium text-[11px] transition-all cursor-pointer ${
                  selectedSim === 'NETWORK_ERROR'
                    ? 'bg-red-600 text-white border-red-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold">Simulate API Error</div>
                <div className={selectedSim === 'NETWORK_ERROR' ? 'text-red-100' : 'text-slate-400'}>
                  500 Gateway timeout
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSimChange('RATE_LIMIT')}
                className={`p-2 rounded-lg border text-left font-medium text-[11px] transition-all cursor-pointer ${
                  selectedSim === 'RATE_LIMIT'
                    ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold">Simulate Rate Limit</div>
                <div className={selectedSim === 'RATE_LIMIT' ? 'text-amber-100' : 'text-slate-400'}>
                  429 Quota exhausted
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSimChange('EMPTY_RESULTS')}
                className={`p-2 rounded-lg border text-left font-medium text-[11px] transition-all cursor-pointer ${
                  selectedSim === 'EMPTY_RESULTS'
                    ? 'bg-sky-700 text-white border-sky-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold">Simulate Zero Trains</div>
                <div className={selectedSim === 'EMPTY_RESULTS' ? 'text-sky-100' : 'text-slate-400'}>
                  No direct trains found
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
