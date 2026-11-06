/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Check } from 'lucide-react';
import { Station } from '../types/railway';
import { searchStations } from '../services/railRadarService';

interface StationAutocompleteProps {
  id: string;
  label: string;
  placeholder: string;
  selectedStation: Station | null;
  onSelectStation: (station: Station | null) => void;
  error?: string;
  autoFocus?: boolean;
}

export const StationAutocomplete: React.FC<StationAutocompleteProps> = ({
  id,
  label,
  placeholder,
  selectedStation,
  onSelectStation,
  error,
  autoFocus = false,
}) => {
  const [inputValue, setInputValue] = useState(
    selectedStation ? `${selectedStation.name} (${selectedStation.code})` : ''
  );
  const [suggestions, setSuggestions] = useState<Station[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync internal input value when selectedStation changes from outside (e.g. swap or recent search)
  useEffect(() => {
    if (selectedStation) {
      setInputValue(`${selectedStation.name} (${selectedStation.code})`);
    } else {
      setInputValue('');
    }
  }, [selectedStation]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // If user typed something but didn't select an item from dropdown, restore or clear
        if (selectedStation) {
          setInputValue(`${selectedStation.name} (${selectedStation.code})`);
        } else {
          setInputValue('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedStation]);

  // Handle input text changes with 300ms debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    // If text is cleared or changed after selection, clear selected station
    if (selectedStation) {
      onSelectStation(null);
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (val.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);
    setHasSearched(true);
    setHighlightedIndex(-1);

    debounceTimerRef.current = setTimeout(async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        const results = await searchStations(val, abortControllerRef.current.signal);
        setSuggestions(results);
      } catch (err: unknown) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error fetching stations:', err);
          setSuggestions([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const handleSelect = (station: Station) => {
    onSelectStation(station);
    setInputValue(`${station.name} (${station.code})`);
    setIsOpen(false);
    setSuggestions([]);
    setHighlightedIndex(-1);
  };

  const handleClear = () => {
    onSelectStation(null);
    setInputValue('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSelect(suggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          {label}
        </label>
        {selectedStation && (
          <span className="text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
            Selected: {selectedStation.code}
          </span>
        )}
      </div>

      <div
        className={`relative flex items-center bg-white rounded-lg border transition-all ${
          error
            ? 'border-red-400 ring-2 ring-red-100'
            : isOpen
            ? 'border-sky-700 ring-2 ring-sky-100'
            : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <div className="pl-3.5 pr-2 text-slate-400">
          <MapPin className="w-5 h-5 text-slate-500" />
        </div>

        <input
          ref={inputRef}
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (inputValue.trim().length >= 2) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full py-2.5 pr-9 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
        />

        <div className="absolute right-2.5 flex items-center gap-1">
          {isLoading && <Loader2 className="w-4 h-4 text-sky-700 animate-spin" />}
          {inputValue && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear station selection"
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Validation error message */}
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
          <span className="inline-block w-1 h-1 rounded-full bg-red-600"></span>
          {error}
        </p>
      )}

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden max-h-72 overflow-y-auto">
          {isLoading && suggestions.length === 0 && (
            <div className="p-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 text-sky-700 animate-spin" />
              <span>Searching Indian Railway stations...</span>
            </div>
          )}

          {!isLoading && suggestions.length === 0 && hasSearched && (
            <div className="p-4 text-center text-slate-600">
              <p className="text-xs font-semibold text-slate-800">No station found.</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Try searching by station code (e.g. NDLS, MMCT, JP).</p>
            </div>
          )}

          {suggestions.length > 0 && (
            <ul className="py-1 divide-y divide-slate-100" role="listbox">
              {suggestions.map((st, index) => {
                const isSelected = selectedStation?.code === st.code;
                const isHighlighted = highlightedIndex === index;

                return (
                  <li
                    key={st.code}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(st)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`px-3.5 py-2.5 cursor-pointer flex items-center justify-between text-left transition-colors ${
                      isHighlighted ? 'bg-sky-50' : isSelected ? 'bg-emerald-50/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 tracking-wider">
                          {st.code}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                          {st.name}
                          {st.zone && (
                            <span className="text-[10px] font-normal text-slate-400">
                              ({st.zone})
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {st.city}, {st.state}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                      <span className="text-[10px] text-slate-400 font-mono">
                        Pop: {st.popularity}%
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
