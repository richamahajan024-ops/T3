/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Train, HelpCircle, User, BookOpen, Info, MapPin } from 'lucide-react';

export type NavTab = 'search' | '3d' | 'chat' | 'info' | 'stations' | 'about';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenHelp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenHelp,
}) => {
  return (
    <header className="bg-sky-950 text-white border-b border-sky-900 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Brand title wordmark */}
          <button
            type="button"
            onClick={() => onSelectTab('search')}
            className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 group focus:outline-none cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-sky-950 font-bold shadow-xs group-hover:bg-amber-400 transition-colors">
              <Train className="w-5 h-5 text-sky-950" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white block leading-tight">
                RailConnect
              </span>
              <span className="text-[10px] font-medium text-sky-300 tracking-wider block">
                Complete Train Search
              </span>
            </div>
          </button>

          {/* Zone 2: Clean single-line nav links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-sky-200">
            <button
              type="button"
              onClick={() => onSelectTab('search')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                activeTab === 'search'
                  ? 'text-white border-amber-400 font-semibold'
                  : 'border-transparent text-sky-200'
              }`}
            >
              Train Search
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('3d')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === '3d'
                  ? 'text-white border-amber-400 font-semibold'
                  : 'border-transparent text-sky-200'
              }`}
            >
              <span>3D Train View</span>
              <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-blue-600 text-white">Three.js</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('chat')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'text-white border-amber-400 font-semibold'
                  : 'border-transparent text-sky-200'
              }`}
            >
              <span>AI Assistant</span>
              <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-amber-600 text-white">Gemini</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('info')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                activeTab === 'info'
                  ? 'text-white border-amber-400 font-semibold'
                  : 'border-transparent text-sky-200'
              }`}
            >
              Train Information
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('stations')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                activeTab === 'stations'
                  ? 'text-white border-amber-400 font-semibold'
                  : 'border-transparent text-sky-200'
              }`}
            >
              Stations
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('about')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                activeTab === 'about'
                  ? 'text-white border-amber-400 font-semibold'
                  : 'border-transparent text-sky-200'
              }`}
            >
              About
            </button>
          </nav>

          {/* Zone 3: 1 primary action & user profile placeholder */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenHelp}
              title="Help & Search Tips"
              className="p-2 text-sky-200 hover:text-white rounded-lg hover:bg-sky-900 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Help</span>
            </button>

            <div className="h-4 w-px bg-sky-800 hidden sm:block"></div>

            <div className="flex items-center gap-2 pl-1" title="Demo passenger session">
              <div className="w-8 h-8 rounded-full bg-sky-800 border border-sky-700 flex items-center justify-center text-sky-200 text-xs font-bold">
                <User className="w-4 h-4 text-sky-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-sky-900 text-[11px] font-medium text-sky-200 overflow-x-auto">
          <button
            type="button"
            onClick={() => onSelectTab('search')}
            className={`px-2 py-1 whitespace-nowrap ${activeTab === 'search' ? 'text-amber-400 font-bold' : ''}`}
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('3d')}
            className={`px-2 py-1 whitespace-nowrap ${activeTab === '3d' ? 'text-amber-400 font-bold' : ''}`}
          >
            3D Train
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('chat')}
            className={`px-2 py-1 whitespace-nowrap ${activeTab === 'chat' ? 'text-amber-400 font-bold' : ''}`}
          >
            AI Assistant
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('info')}
            className={`px-2 py-1 whitespace-nowrap ${activeTab === 'info' ? 'text-amber-400 font-bold' : ''}`}
          >
            Train Info
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('stations')}
            className={`px-2 py-1 whitespace-nowrap ${activeTab === 'stations' ? 'text-amber-400 font-bold' : ''}`}
          >
            Stations
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('about')}
            className={`px-2 py-1 whitespace-nowrap ${activeTab === 'about' ? 'text-amber-400 font-bold' : ''}`}
          >
            About
          </button>
        </div>
      </div>
    </header>
  );
};
