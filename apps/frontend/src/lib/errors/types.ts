export type ErrorCode =
  | 'AUTH_ERROR'
  | 'NETWORK_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'SERVER_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN_ERROR';

export interface AppError {
  code: ErrorCode;
  message: string;
  status?: number;
  details?: Record<string, unknown>;
  originalError?: unknown;
}

export interface ErrorConfig {
  retry?: boolean;
  retryConfig?: {
    maxAttempts?: number;
    baseDelay?: number;
  };
}

export function isAppError(error: unknown): error is AppError {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  const obj = error as Record<string, unknown>;
  return (
    typeof obj['code'] === 'string' &&
    typeof obj['message'] === 'string'
  );
}
