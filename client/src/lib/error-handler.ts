/**
 * Centralized error handling for the application
 */

import { toast } from '@/hooks/use-toast';

interface ErrorContext {
  operation: string;
  details?: any;
  requestId?: string;
}

export class AppError extends Error {
  public code?: string;
  public status?: number;
  public context?: ErrorContext;

  constructor(message: string, code?: string, status?: number, context?: ErrorContext) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.context = context;
  }
}

/**
 * User-friendly error messages
 */
const ERROR_MESSAGES: Record<string, string> = {
  'RATE_LIMIT': 'You\'re making requests too quickly. Please wait a moment and try again.',
  'NETWORK_ERROR': 'Unable to connect to our servers. Please check your internet connection.',
  'TIMEOUT': 'The request took too long. Please try again.',
  'UNAUTHORIZED': 'You need to be logged in to perform this action.',
  'FORBIDDEN': 'You don\'t have permission to perform this action.',
  'NOT_FOUND': 'The requested resource was not found.',
  'VALIDATION_ERROR': 'Please check your input and try again.',
  'SERVER_ERROR': 'Something went wrong on our end. Please try again later.',
  'AI_SERVICE_ERROR': 'AI service is temporarily unavailable. Your content has been saved.',
  'DEFAULT': 'An unexpected error occurred. Please try again.',
};

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: any): string {
  if (error instanceof AppError && error.code) {
    return ERROR_MESSAGES[error.code] || error.message;
  }

  if (error.status === 429) return ERROR_MESSAGES.RATE_LIMIT;
  if (error.status === 401) return ERROR_MESSAGES.UNAUTHORIZED;
  if (error.status === 403) return ERROR_MESSAGES.FORBIDDEN;
  if (error.status === 404) return ERROR_MESSAGES.NOT_FOUND;
  if (error.status >= 500) return ERROR_MESSAGES.SERVER_ERROR;
  
  if (error.message?.includes('fetch')) return ERROR_MESSAGES.NETWORK_ERROR;
  if (error.message?.includes('timeout')) return ERROR_MESSAGES.TIMEOUT;
  
  return ERROR_MESSAGES.DEFAULT;
}

/**
 * Log error for debugging
 */
export function logError(error: any, context?: ErrorContext): void {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    code: error.code,
    status: error.status,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Application Error:', errorInfo);
  }

  // In production, you would send this to an error tracking service
  // Example: Sentry.captureException(error, { extra: errorInfo });
}

/**
 * Handle error and show user notification
 */
export function handleError(error: any, context?: ErrorContext): void {
  // Log the error
  logError(error, context);

  // Get user-friendly message
  const userMessage = getUserFriendlyMessage(error);

  // Show toast notification
  toast({
    title: 'Error',
    description: userMessage,
    variant: 'destructive',
  });
}

/**
 * Wrap async functions with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, { operation: context });
      throw error;
    }
  }) as T;
}

/**
 * React error boundary fallback
 */
export function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{getUserFriendlyMessage(error)}</p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try again
        </button>
      </div>
    </div>
  );
}