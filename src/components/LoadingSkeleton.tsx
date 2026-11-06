/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ViewMode } from '../types/railway';

interface LoadingSkeletonProps {
  viewMode: ViewMode;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ viewMode }) => {
  if (viewMode === 'table') {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden animate-pulse">
        <div className="h-10 bg-slate-100 border-b border-slate-200"></div>
        <div className="divide-y divide-slate-100 p-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="py-4 px-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-1/4">
                <div className="w-14 h-5 bg-slate-200 rounded"></div>
                <div className="w-32 h-4 bg-slate-200 rounded"></div>
              </div>
              <div className="w-20 h-4 bg-slate-200 rounded"></div>
              <div className="w-16 h-4 bg-slate-200 rounded"></div>
              <div className="w-20 h-4 bg-slate-200 rounded"></div>
              <div className="w-16 h-4 bg-slate-200 rounded"></div>
              <div className="w-32 h-5 bg-slate-200 rounded"></div>
              <div className="w-16 h-5 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-14 h-5 bg-slate-200 rounded"></div>
              <div className="w-48 h-5 bg-slate-200 rounded"></div>
            </div>
            <div className="w-20 h-5 bg-slate-200 rounded"></div>
          </div>
          <div className="py-6 grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="w-20 h-7 bg-slate-200 rounded"></div>
              <div className="w-32 h-4 bg-slate-200 rounded"></div>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-16 h-4 bg-slate-200 rounded"></div>
              <div className="w-28 h-1 bg-slate-200 rounded"></div>
            </div>
            <div className="space-y-2 flex flex-col items-end">
              <div className="w-20 h-7 bg-slate-200 rounded"></div>
              <div className="w-32 h-4 bg-slate-200 rounded"></div>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="w-40 h-6 bg-slate-200 rounded"></div>
            <div className="w-24 h-6 bg-slate-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
