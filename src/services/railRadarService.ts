/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MOCK_STATIONS } from '../data/mockStations';
import { MOCK_TRAINS } from '../data/mockTrains';
import { ApiResponse, Station, TrainItem, TrainType, WeekDay } from '../types/railway';

// Cache for station lookup queries (TTL: 5 minutes)
const stationCache = new Map<string, { data: Station[]; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

// Mapping JavaScript getDay() (0 = Sunday, 1 = Monday...) to our WeekDay type
const DAY_MAP: WeekDay[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export interface SearchTrainsParams {
  fromCode: string;
  toCode: string;
  date?: string; // YYYY-MM-DD
  trainType?: TrainType;
  byCity?: boolean;
}

export type SimulatedErrorType = 'NONE' | 'NETWORK_ERROR' | 'RATE_LIMIT' | 'EMPTY_RESULTS';

let currentSimulatedError: SimulatedErrorType = 'NONE';

export const setSimulatedError = (err: SimulatedErrorType) => {
  currentSimulatedError = err;
};

export const getSimulatedError = () => currentSimulatedError;

/**
 * Searches stations matching the query.
 * - Minimum 2 characters
 * - Filters isActive !== false
 * - Sorts by popularity descending
 * - Caches results for 5 minutes
 */
export async function searchStations(
  query: string,
  signal?: AbortSignal
): Promise<Station[]> {
  const trimmed = query.trim().toUpperCase();
  if (trimmed.length < 2) {
    return [];
  }

  // Check cache
  const cached = stationCache.get(trimmed);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // Artificial network delay to mimic real lookup API (150ms)
  await new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, 150);
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    }
  });

  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  const results = MOCK_STATIONS.filter((st) => {
    // Hide stations where isActive = false as required
    if (!st.isActive) return false;

    const codeMatch = st.code.toUpperCase().includes(trimmed);
    const nameMatch = st.name.toUpperCase().includes(trimmed);
    const cityMatch = st.city.toUpperCase().includes(trimmed);

    return codeMatch || nameMatch || cityMatch;
  });

  // Sort suggestions by popularity descending
  results.sort((a, b) => {
    // Prioritize exact code match
    if (a.code === trimmed && b.code !== trimmed) return -1;
    if (b.code === trimmed && a.code !== trimmed) return 1;
    // Then by popularity
    return (b.popularity || 0) - (a.popularity || 0);
  });

  const sliced = results.slice(0, 10);
  stationCache.set(trimmed, { data: sliced, timestamp: Date.now() });
  return sliced;
}

/**
 * Direct train search between stations.
 * Adheres strictly to:
 * - Code-based path parameters
 * - Different from & to
 * - Date operating day resolution
 * - byCity metro group clustering
 * - Train type filtering
 */
export async function fetchTrainsBetween(
  params: SearchTrainsParams
): Promise<ApiResponse<TrainItem[]>> {
  const { fromCode, toCode, date, trainType, byCity } = params;

  // Artificial realistic network delay (350ms)
  await new Promise((res) => setTimeout(res, 350));

  // Check for test simulations
  if (currentSimulatedError === 'NETWORK_ERROR') {
    throw new Error('Unable to retrieve trains. Connection to Indian Railways gateway timed out.');
  }

  if (currentSimulatedError === 'RATE_LIMIT') {
    const err = new Error('API query rate limit exceeded. Please retry in 30 seconds.');
    (err as unknown as { status: number }).status = 429;
    throw err;
  }

  if (currentSimulatedError === 'EMPTY_RESULTS') {
    return {
      success: true,
      data: [],
      total: 0,
      isDemoMode: true,
      message: 'No direct trains found between selected stations.',
    };
  }

  // Find station objects
  const fromStation = MOCK_STATIONS.find((s) => s.code === fromCode);
  const toStation = MOCK_STATIONS.find((s) => s.code === toCode);

  if (!fromStation || !toStation) {
    throw new Error('Invalid station codes provided for search.');
  }

  // Determine eligible origin and destination station codes
  let eligibleOriginCodes = [fromCode];
  let eligibleDestCodes = [toCode];

  if (byCity) {
    if (fromStation.metroGroup) {
      eligibleOriginCodes = MOCK_STATIONS
        .filter((s) => s.isActive && s.metroGroup === fromStation.metroGroup)
        .map((s) => s.code);
    }
    if (toStation.metroGroup) {
      eligibleDestCodes = MOCK_STATIONS
        .filter((s) => s.isActive && s.metroGroup === toStation.metroGroup)
        .map((s) => s.code);
    }
  }

  // Find trains whose origin matches eligibleOriginCodes AND destination matches eligibleDestCodes
  let matchedTrains = MOCK_TRAINS.filter((train) => {
    const originMatch = eligibleOriginCodes.includes(train.from.code);
    const destMatch = eligibleDestCodes.includes(train.to.code);
    return originMatch && destMatch;
  });

  // Filter by Train Type if specified and not 'All Train Types'
  if (trainType && trainType !== 'All Train Types') {
    matchedTrains = matchedTrains.filter(
      (t) => t.train.type.toLowerCase() === trainType.toLowerCase()
    );
  }

  // Filter by Journey Date if specified
  if (date) {
    // Parse date in YYYY-MM-DD
    const [y, m, d] = date.split('-').map(Number);
    const parsedDate = new Date(y, m - 1, d);
    if (!isNaN(parsedDate.getTime())) {
      const dayIndex = parsedDate.getDay();
      const targetDay: WeekDay = DAY_MAP[dayIndex];
      matchedTrains = matchedTrains.filter((t) => t.train.runDays.includes(targetDay));
    }
  }

  // Default sorting: departure time, earliest first
  matchedTrains.sort((a, b) => a.from.departure.localeCompare(b.from.departure));

  return {
    success: true,
    data: matchedTrains,
    total: matchedTrains.length,
    isDemoMode: true,
    message: `${matchedTrains.length} direct trains found`,
  };
}

/**
 * Helper to determine if an arrival is overnight (+1 day, +2 days)
 */
export function getOvernightDays(train: TrainItem): number {
  if (train.to.day && train.from.day && train.to.day > train.from.day) {
    return train.to.day - train.from.day;
  }
  // Fallback calculation: if arrival HH:mm is chronologically before departure HH:mm and duration > 120min
  const [depH, depM] = train.from.departure.split(':').map(Number);
  const [arrH, arrM] = train.to.arrival.split(':').map(Number);
  const depMinutes = depH * 60 + depM;
  const arrMinutes = arrH * 60 + arrM;

  if (arrMinutes < depMinutes || train.duration >= 24 * 60) {
    return Math.max(1, Math.floor(train.duration / 1440));
  }
  return 0;
}

/**
 * Format duration in minutes to user-friendly "Xh Ym"
 */
export function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return 'Not available';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

/**
 * Checks if a train runs on all 7 days (Daily)
 */
export function isDailyTrain(runDays: WeekDay[]): boolean {
  return runDays.length === 7;
}
