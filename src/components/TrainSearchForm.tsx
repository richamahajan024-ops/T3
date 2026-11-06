/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeftRight, Search, Loader2, Info, Sparkles } from 'lucide-react';
import { Station, TrainType } from '../types/railway';
import { StationAutocomplete } from './StationAutocomplete';
import { JourneyDatePicker } from './JourneyDatePicker';
import { TrainTypeFilter } from './TrainTypeFilter';

interface TrainSearchFormProps {
  onSearch: (searchData: {
    fromStation: Station;
    toStation: Station;
    date: string;
    trainType: TrainType;
    byCity: boolean;
  }) => void;
  isLoading: boolean;
  initialValues?: {
    fromStation: Station | null;
    toStation: Station | null;
    date: string;
    trainType: TrainType;
    byCity: boolean;
  };
}

export const TrainSearchForm: React.FC<TrainSearchFormProps> = ({
  onSearch,
  isLoading,
  initialValues,
}) => {
  const [fromStation, setFromStation] = useState<Station | null>(
    initialValues?.fromStation || null
  );
  const [toStation, setToStation] = useState<Station | null>(
    initialValues?.toStation || null
  );
  const [date, setDate] = useState<string>(initialValues?.date || '');
  const [trainType, setTrainType] = useState<TrainType>(
    initialValues?.trainType || 'All Train Types'
  );
  const [byCity, setByCity] = useState<boolean>(initialValues?.byCity || false);

  const [fromError, setFromError] = useState<string>('');
  const [toError, setToError] = useState<string>('');
  const [showCityTooltip, setShowCityTooltip] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  // Sync if initial values change from popular routes or history click
  React.useEffect(() => {
    if (initialValues) {
      setFromStation(initialValues.fromStation);
      setToStation(initialValues.toStation);
      setDate(initialValues.date);
      setTrainType(initialValues.trainType);
      setByCity(initialValues.byCity);
      setFromError('');
      setToError('');
    }
  }, [initialValues]);

  const handleSwapStations = () => {
    setIsSwapping(true);
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
    setFromError('');
    setToError('');
    setTimeout(() => setIsSwapping(false), 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!fromStation) {
      setFromError('Please select a departure station.');
      hasError = true;
    } else {
      setFromError('');
    }

    if (!toStation) {
      setToError('Please select a destination station.');
      hasError = true;
    } else {
      setToError('');
    }

    if (fromStation && toStation && fromStation.code === toStation.code) {
      setToError('From and To stations cannot be the same.');
      hasError = true;
    }

    if (hasError || !fromStation || !toStation) {
      return;
    }

    onSearch({
      fromStation,
      toStation,
      date,
      trainType,
      byCity,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md border border-slate-200/80 p-5 md:p-6 transition-all">
      {/* Station Inputs Row with Swap button */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] gap-4 items-start">
        {/* From Station */}
        <div>
          <StationAutocomplete
            id="from-station"
            label="From Station"
            placeholder="Enter departure station (e.g. New Delhi, NDLS)"
            selectedStation={fromStation}
            onSelectStation={(station) => {
              setFromStation(station);
              if (station) setFromError('');
            }}
            error={fromError}
            autoFocus={!fromStation}
          />
        </div>

        {/* Swap Button */}
        <div className="flex items-center justify-center lg:pt-7">
          <button
            type="button"
            onClick={handleSwapStations}
            title="Swap departure and destination stations"
            aria-label="Swap stations"
            className={`p-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:text-sky-800 hover:bg-sky-50 hover:border-sky-300 transition-all active:scale-95 shadow-xs ${
              isSwapping ? 'rotate-180 duration-300' : ''
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* To Station */}
        <div>
          <StationAutocomplete
            id="to-station"
            label="To Station"
            placeholder="Enter destination station (e.g. Mumbai Central, MMCT)"
            selectedStation={toStation}
            onSelectStation={(station) => {
              setToStation(station);
              if (station) setToError('');
            }}
            error={toError}
          />
        </div>
      </div>

      {/* Date & Train Type Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-100">
        <div>
          <JourneyDatePicker
            value={date}
            onChange={(newDate) => setDate(newDate)}
          />
        </div>

        <div>
          <TrainTypeFilter
            value={trainType}
            onChange={(newType) => setTrainType(newType)}
          />
        </div>
      </div>

      {/* byCity Checkbox & Search Action Row */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Checkbox: Include all stations in these cities */}
        <div className="relative flex items-center">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={byCity}
              onChange={(e) => setByCity(e.target.checked)}
              className="w-4 h-4 text-sky-700 rounded border-slate-300 focus:ring-sky-500 focus:ring-offset-0 cursor-pointer accent-sky-700"
            />
            <span className="text-xs font-medium text-slate-700 hover:text-slate-900">
              Include all stations in these cities
            </span>
          </label>

          <button
            type="button"
            aria-label="Explain include all stations in cities option"
            onClick={() => setShowCityTooltip(!showCityTooltip)}
            onMouseEnter={() => setShowCityTooltip(true)}
            onMouseLeave={() => setShowCityTooltip(false)}
            className="ml-1.5 text-slate-400 hover:text-sky-700 focus:outline-none"
          >
            <Info className="w-3.5 h-3.5" />
          </button>

          {showCityTooltip && (
            <div className="absolute bottom-full left-0 mb-2 w-72 p-2.5 bg-slate-900 text-slate-100 text-[11px] rounded-lg shadow-xl z-50 pointer-events-none leading-relaxed border border-slate-700">
              <span className="font-semibold text-amber-300 block mb-1">Metropolitan Station Clustering (byCity):</span>
              Includes all railway terminals in the metropolitan area. For example, Delhi includes NDLS, NZM, DLI, ANVT, and DEE. Mumbai includes MMCT, CSMT, BDTS, and LTT.
            </div>
          )}
        </div>

        {/* Search Trains CTA Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto px-7 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-semibold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Searching Trains...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Search Direct Trains</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
