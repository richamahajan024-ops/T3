/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Train,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Filter,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';
import {
  Station,
  TrainItem,
  TrainType,
  SortField,
  SortOrder,
  ViewMode,
  SearchHistoryItem,
} from './types/railway';
import { MOCK_STATIONS } from './data/mockStations';
import { fetchTrainsBetween } from './services/railRadarService';
import { Navbar, NavTab } from './components/Navbar';
import { TrainSearchForm } from './components/TrainSearchForm';
import { SearchResultsHeader } from './components/SearchResultsHeader';
import { FilterSortToolbar } from './components/FilterSortToolbar';
import { TrainTable } from './components/TrainTable';
import { TrainCard } from './components/TrainCard';
import { RecentSearches } from './components/RecentSearches';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { HelpModal } from './components/HelpModal';
import { TrainInfoView } from './components/TrainInfoView';
import { StationDirectoryView } from './components/StationDirectoryView';
import { AboutView } from './components/AboutView';
import { ThreeTrainViewer } from './components/ThreeTrainViewer';
import { GeminiChatbot } from './components/GeminiChatbot';
import { RouteIntelCard } from './components/RouteIntelCard';
import { Bot, MessageSquare } from 'lucide-react';

const RECENT_SEARCHES_KEY = 'railconnect_recent_searches_v1';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<NavTab>('search');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>('');

  // Default pre-selected stations: New Delhi (NDLS) to Mumbai Central (MMCT)
  const defaultFrom = useMemo(
    () => MOCK_STATIONS.find((s) => s.code === 'NDLS') || MOCK_STATIONS[0],
    []
  );
  const defaultTo = useMemo(
    () => MOCK_STATIONS.find((s) => s.code === 'MMCT') || MOCK_STATIONS[6],
    []
  );

  // Search form values
  const [currentSearch, setCurrentSearch] = useState<{
    fromStation: Station | null;
    toStation: Station | null;
    date: string;
    trainType: TrainType;
    byCity: boolean;
  }>({
    fromStation: defaultFrom,
    toStation: defaultTo,
    date: '',
    trainType: 'All Train Types',
    byCity: false,
  });

  // Search Results & Async State
  const [trains, setTrains] = useState<TrainItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isRateLimit, setIsRateLimit] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Filter & Sort State within Results
  const [sortBy, setSortBy] = useState<SortField>('departure');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [resultTrainTypeFilter, setResultTrainTypeFilter] = useState<TrainType>('All Train Types');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  // Search History State
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Responsive default view mode
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setViewMode('table');
    } else {
      setViewMode('card');
    }
  }, []);

  // Save history to localStorage
  const saveSearchToHistory = useCallback((item: Omit<SearchHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: SearchHistoryItem = {
      ...item,
      id: `${item.fromStation.code}-${item.toStation.code}-${Date.now()}`,
      timestamp: Date.now(),
    };

    setSearchHistory((prev) => {
      // Remove duplicate of same route
      const filtered = prev.filter(
        (h) =>
          !(
            h.fromStation.code === newItem.fromStation.code &&
            h.toStation.code === newItem.toStation.code
          )
      );
      const updated = [newItem, ...filtered].slice(0, 8);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save recent search:', e);
      }
      return updated;
    });
  }, []);

  // Execute Train Search
  const executeSearch = useCallback(
    async (params: {
      fromStation: Station;
      toStation: Station;
      date: string;
      trainType: TrainType;
      byCity: boolean;
    }) => {
      setIsLoading(true);
      setSearchError(null);
      setIsRateLimit(false);
      setHasSearched(true);

      try {
        const response = await fetchTrainsBetween({
          fromCode: params.fromStation.code,
          toCode: params.toStation.code,
          date: params.date,
          trainType: params.trainType,
          byCity: params.byCity,
        });

        if (response.success) {
          setTrains(response.data);
          saveSearchToHistory({
            fromStation: params.fromStation,
            toStation: params.toStation,
            date: params.date,
            trainType: params.trainType,
            byCity: params.byCity,
          });
        } else {
          setSearchError(response.error || 'Failed to fetch direct trains.');
        }
      } catch (err: unknown) {
        const errorObj = err as { status?: number; message?: string };
        if (errorObj?.status === 429) {
          setIsRateLimit(true);
        }
        setSearchError(errorObj?.message || 'Unable to retrieve trains. Please try again.');
        setTrains([]);
      } finally {
        setIsLoading(false);
      }
    },
    [saveSearchToHistory]
  );

  // Auto-search initial route on mount so user sees immediate results
  useEffect(() => {
    if (defaultFrom && defaultTo) {
      executeSearch({
        fromStation: defaultFrom,
        toStation: defaultTo,
        date: '',
        trainType: 'All Train Types',
        byCity: false,
      });
    }
  }, [defaultFrom, defaultTo, executeSearch]);

  // Handle Form Submission
  const handleFormSearch = (searchData: {
    fromStation: Station;
    toStation: Station;
    date: string;
    trainType: TrainType;
    byCity: boolean;
  }) => {
    setCurrentSearch(searchData);
    setResultTrainTypeFilter(searchData.trainType);
    setSearchQuery('');
    executeSearch(searchData);
  };

  // Handle Quick Route Click (e.g. Delhi ⇄ Jaipur)
  const handleQuickRouteSelect = (fromCode: string, toCode: string) => {
    const from = MOCK_STATIONS.find((s) => s.code === fromCode);
    const to = MOCK_STATIONS.find((s) => s.code === toCode);
    if (!from || !to) return;

    const newSearch = {
      fromStation: from,
      toStation: to,
      date: '',
      trainType: 'All Train Types' as TrainType,
      byCity: false,
    };
    setCurrentSearch(newSearch);
    setResultTrainTypeFilter('All Train Types');
    setSearchQuery('');
    setActiveTab('search');
    executeSearch(newSearch);
  };

  // Handle History Click
  const handleSelectHistory = (item: SearchHistoryItem) => {
    const newSearch = {
      fromStation: item.fromStation,
      toStation: item.toStation,
      date: item.date || '',
      trainType: item.trainType || 'All Train Types',
      byCity: item.byCity || false,
    };
    setCurrentSearch(newSearch);
    setResultTrainTypeFilter(item.trainType || 'All Train Types');
    setSearchQuery('');
    setActiveTab('search');
    executeSearch(newSearch);
  };

  // Clear History
  const handleClearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  // Set Station from Directory
  const handleSetStationFromDirectory = (station: Station, type: 'from' | 'to') => {
    setCurrentSearch((prev) => ({
      ...prev,
      [type === 'from' ? 'fromStation' : 'toStation']: station,
    }));
    setActiveTab('search');
  };

  // Recoveries for Empty State
  const handleClearDate = () => {
    if (!currentSearch.fromStation || !currentSearch.toStation) return;
    const updated = { ...currentSearch, date: '' };
    setCurrentSearch(updated);
    executeSearch({
      ...updated,
      fromStation: currentSearch.fromStation,
      toStation: currentSearch.toStation,
    });
  };

  const handleToggleByCity = () => {
    if (!currentSearch.fromStation || !currentSearch.toStation) return;
    const updated = { ...currentSearch, byCity: true };
    setCurrentSearch(updated);
    executeSearch({
      ...updated,
      fromStation: currentSearch.fromStation,
      toStation: currentSearch.toStation,
    });
  };

  const handleSwapStations = () => {
    if (!currentSearch.fromStation || !currentSearch.toStation) return;
    const updated = {
      ...currentSearch,
      fromStation: currentSearch.toStation,
      toStation: currentSearch.fromStation,
    };
    setCurrentSearch(updated);
    executeSearch({
      ...updated,
      fromStation: updated.fromStation,
      toStation: updated.toStation,
    });
  };

  const handleResetFilters = () => {
    setResultTrainTypeFilter('All Train Types');
    setSearchQuery('');
  };

  // Filtered and Sorted Train Dataset
  const displayedTrains = useMemo(() => {
    let list = [...trains];

    // Filter by Result Train Type
    if (resultTrainTypeFilter !== 'All Train Types') {
      list = list.filter(
        (t) => t.train.type.toLowerCase() === resultTrainTypeFilter.toLowerCase()
      );
    }

    // Filter by Search Query (train name or number)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.train.number.includes(q) ||
          t.train.name.toLowerCase().includes(q) ||
          t.from.code.toLowerCase().includes(q) ||
          t.to.code.toLowerCase().includes(q)
      );
    }

    // Sort Results
    list.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'departure':
          comparison = a.from.departure.localeCompare(b.from.departure);
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
        case 'distance':
          comparison = a.distance - b.distance;
          break;
        case 'name':
          comparison = a.train.name.localeCompare(b.train.name);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [trains, resultTrainTypeFilter, searchQuery, sortBy, sortOrder]);

  const availableTypesInResults = useMemo(() => {
    const set = new Set<TrainType>();
    trains.forEach((t) => set.add(t.train.type));
    return Array.from(set);
  }, [trains]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Bar Contract (§2) */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
        {activeTab === 'search' && (
          <>
            {/* Hero Banner & Search Form */}
            <div className="space-y-4">
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-balance">
                  Find Direct Trains Across India
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed text-balance">
                  Search complete direct train timetables, departure and arrival schedules, intermediate halts, running days, and route distances between any railway stations.
                </p>
              </div>

              {/* Main Search Form */}
              <TrainSearchForm
                onSearch={handleFormSearch}
                isLoading={isLoading}
                initialValues={currentSearch}
              />
            </div>

            {/* Quick 1-Click Popular Routes & Recent Searches */}
            <RecentSearches
              history={searchHistory}
              onSelectHistory={handleSelectHistory}
              onClearHistory={handleClearHistory}
              onSelectQuickRoute={handleQuickRouteSelect}
            />

            {/* Search Results Section */}
            {hasSearched && currentSearch.fromStation && currentSearch.toStation && (
              <section className="space-y-4 pt-2" aria-label="Train Search Results">
                {/* Header Summary */}
                <SearchResultsHeader
                  fromStation={currentSearch.fromStation}
                  toStation={currentSearch.toStation}
                  date={currentSearch.date}
                  trainType={currentSearch.trainType}
                  byCity={currentSearch.byCity}
                  totalCount={trains.length}
                  filteredCount={displayedTrains.length}
                  onRefresh={() => executeSearch({
                    fromStation: currentSearch.fromStation!,
                    toStation: currentSearch.toStation!,
                    date: currentSearch.date,
                    trainType: currentSearch.trainType,
                    byCity: currentSearch.byCity,
                  })}
                  isDemoMode={true}
                />

                {/* Google Search Grounded Route Intelligence */}
                <RouteIntelCard
                  fromStation={`${currentSearch.fromStation.name} (${currentSearch.fromStation.code})`}
                  toStation={`${currentSearch.toStation.name} (${currentSearch.toStation.code})`}
                />

                {/* Loading State */}
                {isLoading && <LoadingSkeleton viewMode={viewMode} />}

                {/* Error State */}
                {!isLoading && searchError && (
                  <ErrorState
                    message={searchError}
                    isRateLimit={isRateLimit}
                    onRetry={() => executeSearch({
                      fromStation: currentSearch.fromStation!,
                      toStation: currentSearch.toStation!,
                      date: currentSearch.date,
                      trainType: currentSearch.trainType,
                      byCity: currentSearch.byCity,
                    })}
                  />
                )}

                {/* Empty State: Zero Trains Found */}
                {!isLoading && !searchError && trains.length === 0 && (
                  <EmptyState
                    fromStation={currentSearch.fromStation}
                    toStation={currentSearch.toStation}
                    date={currentSearch.date}
                    trainType={currentSearch.trainType}
                    byCity={currentSearch.byCity}
                    onClearDate={handleClearDate}
                    onToggleByCity={handleToggleByCity}
                    onSwapStations={handleSwapStations}
                    onResetFilters={handleResetFilters}
                  />
                )}

                {/* Populated Results View */}
                {!isLoading && !searchError && trains.length > 0 && (
                  <div className="space-y-4">
                    {/* Filtering and Sorting Toolbar */}
                    <FilterSortToolbar
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onSortChange={(f, o) => {
                        setSortBy(f);
                        setSortOrder(o);
                      }}
                      trainTypeFilter={resultTrainTypeFilter}
                      onTrainTypeChange={(t) => setResultTrainTypeFilter(t)}
                      searchQuery={searchQuery}
                      onSearchQueryChange={(q) => setSearchQuery(q)}
                      viewMode={viewMode}
                      onViewModeChange={(m) => setViewMode(m)}
                      availableTypes={availableTypesInResults}
                    />

                    {/* Zero matching client-side filter items */}
                    {displayedTrains.length === 0 ? (
                      <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center shadow-xs">
                        <p className="text-sm font-semibold text-slate-800">
                          No trains match the filter criteria.
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Try searching for another train name/number or reset the train type filter.
                        </p>
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="mt-4 px-4 py-2 rounded-lg bg-sky-900 text-white text-xs font-semibold hover:bg-sky-800 transition-colors"
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : viewMode === 'table' ? (
                      <TrainTable trains={displayedTrains} />
                    ) : (
                      <div className="space-y-3.5">
                        {displayedTrains.map((train) => (
                          <TrainCard key={train.train.number} train={train} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}
          </>
        )}

        {/* Tab 2: 3D Train Viewer (Three.js) */}
        {activeTab === '3d' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Train className="w-5 h-5 text-blue-600" />
                    3D Locomotive & Train Viewer (Three.js)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Explore the procedural 3D model of Indian Railways Vande Bharat Express (Train 18). Inspect the aerodynamic cab, rooftop pantograph, bogie wheel assemblies, and track infrastructure with realistic studio PBR lighting.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                    WebGL 60 FPS
                  </span>
                </div>
              </div>
            </div>

            <ThreeTrainViewer />
          </div>
        )}

        {/* Tab 3: Gemini AI Chatbot with Google Search Grounding */}
        {activeTab === 'chat' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-amber-600" />
                    RailConnect Sahayak – AI Train Travel Assistant
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Ask questions about direct Indian railway routes, train categories, overnight arrivals, or retrieve verified up-to-date schedule advisories using <strong>Google Search Grounding</strong>.
                  </p>
                </div>
              </div>
            </div>

            <GeminiChatbot
              initialPrompt={chatInitialPrompt}
              routeContext={
                currentSearch.fromStation && currentSearch.toStation
                  ? {
                      fromStation: `${currentSearch.fromStation.name} (${currentSearch.fromStation.code})`,
                      toStation: `${currentSearch.toStation.name} (${currentSearch.toStation.code})`,
                      date: currentSearch.date,
                    }
                  : null
              }
            />
          </div>
        )}

        {/* Tab 4: Train Information */}
        {activeTab === 'info' && <TrainInfoView />}

        {/* Tab 5: Station Directory */}
        {activeTab === 'stations' && (
          <StationDirectoryView onSetStation={handleSetStationFromDirectory} />
        )}

        {/* Tab 6: About & Technical Specifications */}
        {activeTab === 'about' && <AboutView />}
      </main>

      {/* Floating Action Button for Quick AI Assistant */}
      {activeTab !== 'chat' && (
        <button
          type="button"
          onClick={() => {
            if (currentSearch.fromStation && currentSearch.toStation) {
              setChatInitialPrompt(
                `Tell me about direct train options between ${currentSearch.fromStation.name} (${currentSearch.fromStation.code}) and ${currentSearch.toStation.name} (${currentSearch.toStation.code}) and any travel tips.`
              );
            }
            setActiveTab('chat');
          }}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-bold text-xs cursor-pointer group hover:scale-105"
          title="Ask RailConnect AI Assistant"
        >
          <Bot className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
          <span>Ask RailConnect AI</span>
          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-amber-800 text-amber-100 uppercase">
            Grounding
          </span>
        </button>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">RailConnect</span>
            <span>·</span>
            <span>Complete Train Search Prototype (BRD T3-06)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Timetable Discovery Platform</span>
            <span>·</span>
            <span className="font-mono text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              DEMO DATA MODE
            </span>
          </div>
        </div>
      </footer>

      {/* Quick Help & Evaluator Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onSimulationChange={() => {
          if (currentSearch.fromStation && currentSearch.toStation) {
            executeSearch({
              fromStation: currentSearch.fromStation,
              toStation: currentSearch.toStation,
              date: currentSearch.date,
              trainType: currentSearch.trainType,
              byCity: currentSearch.byCity,
            });
          }
        }}
      />
    </div>
  );
}
