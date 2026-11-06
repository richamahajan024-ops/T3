/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
  isRateLimit?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Unable to retrieve trains. Please try again.',
  onRetry,
  isRateLimit = false,
}) => {
  return (
    <div className="bg-white rounded-xl border border-red-200/80 p-8 md:p-10 text-center shadow-xs max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>

      <h3 className="text-base font-bold text-slate-900">
        {isRateLimit ? 'Query Limit Reached' : 'Service Temporarily Unavailable'}
      </h3>

      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
        {isRateLimit
          ? 'Too many timetable requests were dispatched in a short window. Please wait a moment before searching again.'
          : message}
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="px-5 py-2.5 rounded-lg bg-sky-900 hover:bg-sky-800 text-white text-xs font-semibold shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Search</span>
        </button>
      </div>

      <p className="text-[11px] text-slate-400 mt-4">
        Previously selected departure, destination and filter criteria have been preserved.
      </p>
    </div>
  );
};
