import type { AppError, ErrorCode } from './types';

export function createError(
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>,
  originalError?: unknown
): AppError {
  return {
    code,
    message,
    details,
    originalError,
  };
}

export async function fromResponse(response: Response): Promise<AppError> {
  const status = response.status;
  let message = 'An error occurred';
  let code: ErrorCode = 'UNKNOWN_ERROR';
  let details: Record<string, unknown> = { status };

  try {
    const body = await response.json();
    if (body.message) {
      message = body.message;
    }
    if (body.details) {
      details = { ...details, ...body.details };
    }
  } catch {
    message = response.statusText || message;
  }

  if (status === 401) {
    code = 'AUTH_ERROR';
    message = message || 'Authentication failed';
  } else if (status === 403) {
    code = 'AUTH_ERROR';
    message = message || 'Access denied';
  } else if (status === 429) {
    code = 'RATE_LIMIT_ERROR';
    message = message || 'Too many requests';
  } else if (status >= 500) {
    code = 'SERVER_ERROR';
    message = message || 'Server error';
  } else if (status >= 400 && status < 500 && status !== 401 && status !== 403) {
    code = 'VALIDATION_ERROR';
  }

  return {
    code,
    message,
    status,
    details,
  };
}

export function fromError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    const message = error.message;

    if (message.toLowerCase().includes('network') || message.toLowerCase().includes('fetch')) {
      return createError('NETWORK_ERROR', 'Network error', undefined, error);
    }

    if (message.toLowerCase().includes('auth') || message.toLowerCase().includes('token')) {
      return createError('AUTH_ERROR', 'Authentication failed', undefined, error);
    }

    return createError('UNKNOWN_ERROR', message, undefined, error);
  }

  return createError('UNKNOWN_ERROR', 'An unknown error occurred', undefined, error);
}

export function isRetryable(error: AppError | Response | unknown): boolean {
  if (error instanceof Response) {
    const status = error.status;
    return status === 408 || status === 429 || (status >= 500 && status <= 504);
  }

  if (isAppError(error)) {
    const retryableCodes: ErrorCode[] = ['NETWORK_ERROR', 'SERVER_ERROR', 'RATE_LIMIT_ERROR'];
    if (retryableCodes.includes(error.code)) {
      return true;
    }
    if (error.status) {
      return error.status === 408 || error.status === 429 || (error.status >= 500 && error.status <= 504);
    }
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('network') || message.includes('fetch') || message.includes('ECONNREFUSED');
  }

  return false;
}

export function getRetryAfter(response: Response): number | null {
  const retryAfter = response.headers.get('Retry-After');
  if (retryAfter) {
    const seconds = parseInt(retryAfter, 10);
    if (!isNaN(seconds)) {
      return seconds * 1000;
    }
  }
  return null;
}

function isAppError(error: unknown): error is AppError {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  const obj = error as Record<string, unknown>;
  return (
    typeof obj['code'] === 'string' &&
    typeof obj['message'] === 'string'
  );
}
