'use client';

import React, { useEffect } from 'react';
import { ErrorService } from '@/services/errorService';
import { ErrorBoundary } from './ErrorBoundary';

interface GlobalErrorHandlerProps {
  children: React.ReactNode;
}

export function GlobalErrorHandler({ children }: GlobalErrorHandlerProps) {
  useEffect(() => {
    // Initialize error service
    ErrorService.initialize();

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      ErrorService.logError({
        error: event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        type: 'client',
        severity: 'high',
        context: {
          type: 'unhandledRejection',
          timestamp: new Date().toISOString(),
          url: window.location.href
        }
      }).catch(console.error);
    };

    // Handle global errors
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      
      ErrorService.logError({
        error: event.error || new Error(event.message),
        type: 'client',
        severity: 'high',
        context: {
          type: 'globalError',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          timestamp: new Date().toISOString(),
          url: window.location.href
        }
      }).catch(console.error);
    };

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleGlobalError);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Application Error
            </h1>
            <p className="text-gray-600 mb-6">
              We're experiencing technical difficulties. Please refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

// Hook for manual error reporting
export function useErrorReporting() {
  const reportError = React.useCallback(async (
    error: Error,
    context?: Record<string, any>
  ) => {
    try {
      await ErrorService.logError({
        error,
        type: 'client',
        severity: 'medium',
        context: {
          ...context,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        }
      });
    } catch (logError) {
      console.error('Failed to report error:', logError);
    }
  }, []);

  const reportApiError = React.useCallback(async (
    error: Error,
    endpoint: string,
    method: string,
    statusCode?: number,
    requestData?: any,
    responseData?: any
  ) => {
    try {
      await ErrorService.logApiError({
        error,
        endpoint,
        method,
        statusCode,
        requestData,
        responseData
      });
    } catch (logError) {
      console.error('Failed to report API error:', logError);
    }
  }, []);

  const reportAuthError = React.useCallback(async (
    error: Error,
    action: string,
    userId?: string,
    email?: string
  ) => {
    try {
      await ErrorService.logAuthError({
        error,
        action,
        userId,
        email
      });
    } catch (logError) {
      console.error('Failed to report auth error:', logError);
    }
  }, []);

  return {
    reportError,
    reportApiError,
    reportAuthError
  };
}