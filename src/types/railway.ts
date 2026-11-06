/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TrainType =
  | 'All Train Types'
  | 'Vande Bharat'
  | 'Rajdhani'
  | 'Shatabdi'
  | 'Duronto'
  | 'Garib Rath'
  | 'Superfast'
  | 'Express'
  | 'Passenger'
  | 'Local'
  | 'Special';

export type WeekDay = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export interface Station {
  code: string;
  name: string;
  city: string;
  state: string;
  zone?: string;
  isActive: boolean;
  popularity: number;
  metroGroup?: string; // Grouping key for byCity search (e.g. 'DELHI', 'MUMBAI')
}

export interface TrainHalt {
  stationCode: string;
  stationName: string;
  arrival: string; // HH:mm
  departure: string; // HH:mm
  haltMinutes: number;
  distanceKm: number;
  day: number;
}

export interface TrainItem {
  train: {
    number: string;
    name: string;
    type: TrainType;
    runDays: WeekDay[];
    classes?: string[];
    pantry?: boolean;
  };
  from: {
    code: string;
    name: string;
    departure: string; // HH:mm
    day: number;
    platform?: string;
  };
  to: {
    code: string;
    name: string;
    arrival: string; // HH:mm
    day: number;
    platform?: string;
  };
  distance: number; // in kilometers
  duration: number; // in minutes
  totalHaltsBetween: number;
  halts?: TrainHalt[];
  remarks?: string;
}

export interface SearchFormData {
  fromStation: Station | null;
  toStation: Station | null;
  date: string; // YYYY-MM-DD or empty
  trainType: TrainType;
  byCity: boolean;
}

export interface SearchHistoryItem {
  id: string;
  fromStation: Station;
  toStation: Station;
  date?: string;
  trainType: TrainType;
  byCity: boolean;
  timestamp: number;
}

export type SortField = 'departure' | 'duration' | 'distance' | 'name';
export type SortOrder = 'asc' | 'desc';
export type ViewMode = 'table' | 'card';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  isDemoMode: boolean;
  message?: string;
  error?: string;
}
