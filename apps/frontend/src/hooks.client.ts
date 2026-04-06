import { isAppError, type AppError } from '$lib/errors/types';
import { authClient } from '$lib/auth-client';

export function handleError(error: unknown): void {
  if (isAppError(error)) {
    const appError = error as AppError;
    
    if (appError.code === 'AUTH_ERROR') {
      console.warn('[Auth Error] Redirecting to login:', appError.message);
      authClient.signOut();
      return;
    }

    if (appError.code === 'NETWORK_ERROR') {
      console.error('[Network Error] Connection failed:', appError.message);
      return;
    }

    if (appError.code === 'RATE_LIMIT_ERROR') {
      console.warn('[Rate Limit] Too many requests:', appError.message);
      return;
    }

    console.error('[App Error]', appError.code, appError.message, appError.details);
    return;
  }

  if (error instanceof Error) {
    console.error('[Unhandled Error]', error.name, error.message, error.stack);
    return;
  }

  console.error('[Unknown Error]', error);
}

export async function setupClientErrorHandlers(): Promise<void> {
  if (typeof window === 'undefined') return;

  window.onerror = (message, source, lineno, colno, error) => {
    console.error('[Global Error]', { message, source, lineno, colno, error });
    handleError(error || new Error(String(message)));
    return false;
  };

  window.onunhandledrejection = (event) => {
    console.error('[Unhandled Promise Rejection]', event.reason);
    handleError(event.reason);
  };
}

export function init(): void {
  setupClientErrorHandlers().catch(console.error);
}
