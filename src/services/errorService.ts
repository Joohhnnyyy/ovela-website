import { supabase } from '@/lib/supabase';

export interface ErrorLog {
  id?: string;
  error_type: 'client' | 'server' | 'api' | 'database' | 'auth' | 'payment';
  error_message: string;
  error_stack?: string;
  user_id?: string;
  session_id?: string;
  url?: string;
  user_agent?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
  resolved: boolean;
}

export interface ErrorMetrics {
  totalErrors: number;
  errorsByType: Record<string, number>;
  errorsBySeverity: Record<string, number>;
  recentErrors: ErrorLog[];
  errorRate: number;
}

export class ErrorService {
  private static readonly MAX_STACK_LENGTH = 2000;
  private static readonly MAX_CONTEXT_SIZE = 5000;
  private static sessionId: string;

  /**
   * Initialize error service with session tracking
   */
  static initialize(): void {
    if (typeof window === 'undefined') return;
    
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Set up global error handlers
    this.setupGlobalErrorHandlers();
  }

  /**
   * Log an error to the database and console
   */
  static async logError({
    error,
    type = 'client',
    severity = 'medium',
    context = {},
    userId,
    url
  }: {
    error: Error | string;
    type?: ErrorLog['error_type'];
    severity?: ErrorLog['severity'];
    context?: Record<string, any>;
    userId?: string;
    url?: string;
  }): Promise<void> {
    try {
      const errorMessage = error instanceof Error ? error.message : error;
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      const errorLog: Omit<ErrorLog, 'id'> = {
        error_type: type,
        error_message: errorMessage.substring(0, 500), // Limit message length
        error_stack: errorStack?.substring(0, this.MAX_STACK_LENGTH),
        user_id: userId,
        session_id: this.sessionId,
        url: url || (typeof window !== 'undefined' ? window.location.href : undefined),
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
        timestamp: new Date().toISOString(),
        severity,
        context: this.sanitizeContext(context),
        resolved: false
      };

      // Log to console based on severity
      this.logToConsole(errorLog);

      // Store in database (non-blocking)
      this.storeErrorInDatabase(errorLog).catch(dbError => {
        console.error('Failed to store error in database:', dbError);
      });

      // Send to external monitoring service if configured
      this.sendToMonitoring(errorLog).catch(monitoringError => {
        console.error('Failed to send error to monitoring:', monitoringError);
      });

    } catch (loggingError) {
      console.error('Error in error logging:', loggingError);
    }
  }

  /**
   * Log API errors with request/response context
   */
  static async logApiError({
    error,
    endpoint,
    method,
    statusCode,
    requestData,
    responseData,
    userId
  }: {
    error: Error | string;
    endpoint: string;
    method: string;
    statusCode?: number;
    requestData?: any;
    responseData?: any;
    userId?: string;
  }): Promise<void> {
    const context = {
      endpoint,
      method,
      statusCode,
      requestData: this.sanitizeData(requestData),
      responseData: this.sanitizeData(responseData)
    };

    const severity = this.determineSeverityFromStatus(statusCode);

    await this.logError({
      error,
      type: 'api',
      severity,
      context,
      userId,
      url: endpoint
    });
  }

  /**
   * Log database errors
   */
  static async logDatabaseError({
    error,
    query,
    table,
    operation,
    userId
  }: {
    error: Error | string;
    query?: string;
    table?: string;
    operation?: string;
    userId?: string;
  }): Promise<void> {
    const context = {
      query: query?.substring(0, 500),
      table,
      operation
    };

    await this.logError({
      error,
      type: 'database',
      severity: 'high',
      context,
      userId
    });
  }

  /**
   * Log authentication errors
   */
  static async logAuthError({
    error,
    action,
    userId,
    email
  }: {
    error: Error | string;
    action: string;
    userId?: string;
    email?: string;
  }): Promise<void> {
    const context = {
      action,
      email: email ? this.maskEmail(email) : undefined
    };

    await this.logError({
      error,
      type: 'auth',
      severity: 'medium',
      context,
      userId
    });
  }

  /**
   * Get error metrics for monitoring dashboard
   */
  static async getErrorMetrics(timeRange: '1h' | '24h' | '7d' = '24h'): Promise<ErrorMetrics> {
    try {
      const hoursBack = timeRange === '1h' ? 1 : timeRange === '24h' ? 24 : 168;
      const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();

      const response = await fetch(`/api/errors?action=metrics&since=${since}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const errors = await response.json();
      return this.processErrorMetrics(errors || []);
    } catch (error) {
      console.error('Error fetching error metrics:', error);
      return {
        totalErrors: 0,
        errorsByType: {},
        errorsBySeverity: {},
        recentErrors: [],
        errorRate: 0
      };
    }
  }

  /**
   * Get error statistics
   */
  static async getErrorStatistics(since: Date = new Date(Date.now() - 24 * 60 * 60 * 1000)) {
    try {
      const response = await fetch(`/api/errors?action=statistics&since=${since.toISOString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get error statistics:', error);
      return null;
    }
  }

  /**
   * Mark an error as resolved
   */
  static async resolveError(errorId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          action: 'resolve',
          errorId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error resolving error:', error);
      return false;
    }
  }

  /**
   * Set up global error handlers for unhandled errors
   */
  private static setupGlobalErrorHandlers(): void {
    if (typeof window === 'undefined') return;

    // Handle unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError({
        error: event.error || new Error(event.message),
        type: 'client',
        severity: 'high',
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        error: event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        type: 'client',
        severity: 'high',
        context: {
          type: 'unhandled_promise_rejection'
        }
      });
    });
  }

  /**
   * Store error in database
   */
  private static async storeErrorInDatabase(errorLog: Omit<ErrorLog, 'id'>): Promise<void> {
    const response = await fetch('/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'log',
        errorType: errorLog.error_type,
        errorMessage: errorLog.error_message,
        errorStack: errorLog.error_stack,
        userId: errorLog.user_id,
        sessionId: errorLog.session_id,
        url: errorLog.url,
        userAgent: errorLog.user_agent,
        severity: errorLog.severity,
        context: errorLog.context
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  /**
   * Get authentication token
   */
  private static async getAuthToken(): Promise<string> {
    try {
      // Try to get token from auth context or local storage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (token) return token;
      }
      return '';
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return '';
    }
  }

  /**
   * Send error to external monitoring service
   */
  private static async sendToMonitoring(errorLog: Omit<ErrorLog, 'id'>): Promise<void> {
    // Implement integration with external monitoring services like Sentry, LogRocket, etc.
    // For now, this is a placeholder
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Sentry or other monitoring service
      console.log('Would send to monitoring service:', errorLog);
    }
  }

  /**
   * Log to console with appropriate level
   */
  private static logToConsole(errorLog: Omit<ErrorLog, 'id'>): void {
    const logData = {
      message: errorLog.error_message,
      type: errorLog.error_type,
      severity: errorLog.severity,
      context: errorLog.context,
      stack: errorLog.error_stack
    };

    switch (errorLog.severity) {
      case 'critical':
      case 'high':
        console.error('[ERROR]', logData);
        break;
      case 'medium':
        console.warn('[WARNING]', logData);
        break;
      case 'low':
        console.info('[INFO]', logData);
        break;
    }
  }

  /**
   * Sanitize context data to prevent sensitive information leakage
   */
  private static sanitizeContext(context: Record<string, any>): Record<string, any> {
    const sanitized = { ...context };
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth', 'credit_card', 'ssn'];
    
    const sanitizeObject = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      const result: any = Array.isArray(obj) ? [] : {};
      
      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
          result[key] = '[REDACTED]';
        } else if (typeof value === 'object') {
          result[key] = sanitizeObject(value);
        } else {
          result[key] = value;
        }
      }
      
      return result;
    };

    const sanitizedContext = sanitizeObject(sanitized);
    const contextString = JSON.stringify(sanitizedContext);
    
    if (contextString.length > this.MAX_CONTEXT_SIZE) {
      return { ...sanitizedContext, _truncated: true };
    }
    
    return sanitizedContext;
  }

  /**
   * Sanitize data for logging
   */
  private static sanitizeData(data: any): any {
    if (!data) return data;
    
    try {
      const stringified = JSON.stringify(data);
      if (stringified.length > 1000) {
        return { _truncated: true, _size: stringified.length };
      }
      return this.sanitizeContext(data);
    } catch {
      return { _error: 'Failed to serialize data' };
    }
  }

  /**
   * Determine error severity from HTTP status code
   */
  private static determineSeverityFromStatus(statusCode?: number): ErrorLog['severity'] {
    if (!statusCode) return 'medium';
    
    if (statusCode >= 500) return 'critical';
    if (statusCode >= 400) return 'high';
    if (statusCode >= 300) return 'medium';
    return 'low';
  }

  /**
   * Mask email for privacy
   */
  private static maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!domain) return '[INVALID_EMAIL]';
    
    const maskedLocal = local.length > 2 
      ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
      : local[0] + '*';
    
    return `${maskedLocal}@${domain}`;
  }

  /**
   * Process raw error data into metrics
   */
  private static processErrorMetrics(errors: any[]): ErrorMetrics {
    const totalErrors = errors.length;
    const errorsByType: Record<string, number> = {};
    const errorsBySeverity: Record<string, number> = {};
    
    errors.forEach(error => {
      errorsByType[error.error_type] = (errorsByType[error.error_type] || 0) + 1;
      errorsBySeverity[error.severity] = (errorsBySeverity[error.severity] || 0) + 1;
    });
    
    const recentErrors = errors
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
    
    // Calculate error rate (errors per hour)
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const recentErrorCount = errors.filter(error => 
      new Date(error.timestamp) > oneHourAgo
    ).length;
    
    return {
      totalErrors,
      errorsByType,
      errorsBySeverity,
      recentErrors,
      errorRate: recentErrorCount
    };
  }
}

// Initialize error service on import
if (typeof window !== 'undefined') {
  ErrorService.initialize();
}