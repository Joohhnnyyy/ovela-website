import { FirestoreError } from 'firebase/firestore';

/**
 * Handle Firestore errors and provide user-friendly error messages
 */
export function handleFirestoreError(error: any): string {
  console.error('Firestore error:', error);
  
  if (error instanceof FirestoreError) {
    switch (error.code) {
      case 'unavailable':
        return 'Service temporarily unavailable. Please check your internet connection and try again.';
      case 'permission-denied':
        return 'You do not have permission to perform this action.';
      case 'not-found':
        return 'The requested data was not found.';
      case 'already-exists':
        return 'This item already exists.';
      case 'resource-exhausted':
        return 'Service quota exceeded. Please try again later.';
      case 'failed-precondition':
        return 'Operation failed due to invalid conditions.';
      case 'aborted':
        return 'Operation was aborted. Please try again.';
      case 'out-of-range':
        return 'Invalid input parameters.';
      case 'unimplemented':
        return 'This feature is not yet implemented.';
      case 'internal':
        return 'Internal server error. Please try again later.';
      case 'deadline-exceeded':
        return 'Request timed out. Please check your connection and try again.';
      case 'cancelled':
        return 'Operation was cancelled.';
      case 'invalid-argument':
        return 'Invalid request parameters.';
      case 'data-loss':
        return 'Data corruption detected. Please contact support.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
  
  // Handle network errors
  if (error.message?.includes('network') || error.message?.includes('offline')) {
    return 'Network connection error. Please check your internet connection and try again.';
  }
  
  // Handle CORS errors
  if (error.message?.includes('CORS') || error.message?.includes('cross-origin')) {
    return 'Connection blocked by browser security. Please refresh the page and try again.';
  }
  
  // Generic error fallback
  return 'An unexpected error occurred. Please try again later.';
}

/**
 * Check if the error is a network-related error
 */
export function isNetworkError(error: any): boolean {
  if (error instanceof FirestoreError) {
    return ['unavailable', 'deadline-exceeded', 'aborted'].includes(error.code);
  }
  
  return error.message?.includes('network') || 
         error.message?.includes('offline') ||
         error.message?.includes('ERR_NETWORK') ||
         error.message?.includes('ERR_ABORTED');
}

/**
 * Retry function for network-related operations
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Only retry on network errors
      if (!isNetworkError(error) || attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
}