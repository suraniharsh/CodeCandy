import React from 'react';
import { FiWifi, FiRefreshCw } from 'react-icons/fi';

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const isNetworkError = error?.message?.includes('ERR_NAME_NOT_RESOLVED') || 
                        error?.message?.includes('auth/internal-error');

  const handleRetry = () => {
    // Check internet connection
    if (navigator.onLine) {
      resetErrorBoundary?.();
      window.location.reload();
    } else {
      // Show offline message
      alert('Please check your internet connection and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="bg-dark-800 rounded-lg border border-dark-700 shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex flex-col items-center space-y-6">
          {isNetworkError ? (
            <>
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                <FiWifi className="w-10 h-10 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-dark-100 mb-2">
                  Connection Error
                </h2>
                <p className="text-dark-300 mb-4">
                  Please check your internet connection and try again. If the problem persists, 
                  the service might be temporarily unavailable.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <span className="text-4xl">⚠️</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-dark-100 mb-2">
                  Something went wrong
                </h2>
                <p className="text-dark-300 mb-4">
                  {error?.message || 'An unexpected error occurred. Please try again.'}
                </p>
              </div>
            </>
          )}

          <button
            onClick={handleRetry}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-smooth"
          >
            <FiRefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </button>

          {isNetworkError && (
            <div className="text-sm text-dark-400 mt-4">
              <p>Troubleshooting steps:</p>
              <ul className="list-disc list-inside mt-2 text-left">
                <li>Check your internet connection</li>
                <li>Verify your Wi-Fi or mobile data is enabled</li>
                <li>Check if other websites are accessible</li>
                <li>Clear your browser cache and cookies</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 