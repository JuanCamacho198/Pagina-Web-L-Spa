import { describe, it, expect } from 'bun:test';
import { createError, fromError, isRetryable, getRetryAfter } from '../src/lib/errors/factory';
import type { AppError, ErrorCode } from '../src/lib/errors/types';

describe('Error Factory - createError', () => {
  it('should create error with code and message', () => {
    const error = createError('NETWORK_ERROR', 'Network failed');
    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.message).toBe('Network failed');
  });

  it('should create error with details', () => {
    const error = createError('VALIDATION_ERROR', 'Invalid input', { field: 'email' });
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.message).toBe('Invalid input');
    expect(error.details?.field).toBe('email');
  });

  it('should create error with original error', () => {
    const original = new Error('Original error');
    const error = createError('UNKNOWN_ERROR', 'Something went wrong', undefined, original);
    expect(error.originalError).toBe(original);
  });

  it('should create all error code types', () => {
    const errorCodes: ErrorCode[] = [
      'AUTH_ERROR',
      'NETWORK_ERROR',
      'RATE_LIMIT_ERROR',
      'SERVER_ERROR',
      'VALIDATION_ERROR',
      'UNKNOWN_ERROR',
    ];

    errorCodes.forEach((code) => {
      const error = createError(code, `Error: ${code}`);
      expect(error.code).toBe(code);
    });
  });
});

describe('Error Factory - fromError', () => {
  it('should return AppError as-is if already an AppError', () => {
    const original: AppError = { code: 'AUTH_ERROR', message: 'Already an error' };
    const result = fromError(original);
    expect(result).toBe(original);
  });

  it('should convert Error with network message to NETWORK_ERROR', () => {
    const error = new Error('Network request failed');
    const result = fromError(error);
    expect(result.code).toBe('NETWORK_ERROR');
    expect(result.originalError).toBe(error);
  });

  it('should convert Error with fetch message to NETWORK_ERROR', () => {
    const error = new Error('fetch failed');
    const result = fromError(error);
    expect(result.code).toBe('NETWORK_ERROR');
  });

  it('should convert Error with auth message to AUTH_ERROR', () => {
    const error = new Error('Authentication token expired');
    const result = fromError(error);
    expect(result.code).toBe('AUTH_ERROR');
  });

  it('should convert generic Error to UNKNOWN_ERROR', () => {
    const error = new Error('Something went wrong');
    const result = fromError(error);
    expect(result.code).toBe('UNKNOWN_ERROR');
    expect(result.message).toBe('Something went wrong');
  });

  it('should handle non-Error objects', () => {
    const result = fromError('string error');
    expect(result.code).toBe('UNKNOWN_ERROR');
  });

  it('should handle null', () => {
    const result = fromError(null);
    expect(result.code).toBe('UNKNOWN_ERROR');
  });

  it('should handle undefined', () => {
    const result = fromError(undefined);
    expect(result.code).toBe('UNKNOWN_ERROR');
  });
});

describe('Error Factory - isRetryable', () => {
  it('should return true for Response with status 408', () => {
    const response = new Response(null, { status: 408 });
    expect(isRetryable(response)).toBe(true);
  });

  it('should return true for Response with status 429', () => {
    const response = new Response(null, { status: 429 });
    expect(isRetryable(response)).toBe(true);
  });

  it('should return true for Response with status 500', () => {
    const response = new Response(null, { status: 500 });
    expect(isRetryable(response)).toBe(true);
  });

  it('should return true for Response with status 502', () => {
    const response = new Response(null, { status: 502 });
    expect(isRetryable(response)).toBe(true);
  });

  it('should return true for Response with status 503', () => {
    const response = new Response(null, { status: 503 });
    expect(isRetryable(response)).toBe(true);
  });

  it('should return true for Response with status 504', () => {
    const response = new Response(null, { status: 504 });
    expect(isRetryable(response)).toBe(true);
  });

  it('should return false for Response with status 400', () => {
    const response = new Response(null, { status: 400 });
    expect(isRetryable(response)).toBe(false);
  });

  it('should return false for Response with status 401', () => {
    const response = new Response(null, { status: 401 });
    expect(isRetryable(response)).toBe(false);
  });

  it('should return false for Response with status 403', () => {
    const response = new Response(null, { status: 403 });
    expect(isRetryable(response)).toBe(false);
  });

  it('should return false for Response with status 404', () => {
    const response = new Response(null, { status: 404 });
    expect(isRetryable(response)).toBe(false);
  });

  it('should return false for Response with status 422', () => {
    const response = new Response(null, { status: 422 });
    expect(isRetryable(response)).toBe(false);
  });

  it('should return true for AppError with NETWORK_ERROR', () => {
    const error: AppError = { code: 'NETWORK_ERROR', message: 'Network error' };
    expect(isRetryable(error)).toBe(true);
  });

  it('should return true for AppError with SERVER_ERROR', () => {
    const error: AppError = { code: 'SERVER_ERROR', message: 'Server error', status: 500 };
    expect(isRetryable(error)).toBe(true);
  });

  it('should return true for AppError with RATE_LIMIT_ERROR', () => {
    const error: AppError = { code: 'RATE_LIMIT_ERROR', message: 'Rate limited', status: 429 };
    expect(isRetryable(error)).toBe(true);
  });

  it('should return false for AppError with AUTH_ERROR', () => {
    const error: AppError = { code: 'AUTH_ERROR', message: 'Auth error', status: 401 };
    expect(isRetryable(error)).toBe(false);
  });

  it('should return false for AppError with VALIDATION_ERROR', () => {
    const error: AppError = { code: 'VALIDATION_ERROR', message: 'Validation error', status: 400 };
    expect(isRetryable(error)).toBe(false);
  });

  it('should return true for Error with network message', () => {
    const error = new Error('network error');
    expect(isRetryable(error)).toBe(true);
  });

  it('should return true for Error with fetch message', () => {
    const error = new Error('fetch failed');
    expect(isRetryable(error)).toBe(true);
  });

  it('should return false for unknown objects', () => {
    expect(isRetryable('unknown')).toBe(false);
  });
});

describe('Error Factory - getRetryAfter', () => {
  it('should return milliseconds from Retry-After header', () => {
    const response = new Response(null, {
      headers: { 'Retry-After': '5' },
    });
    expect(getRetryAfter(response)).toBe(5000);
  });

  it('should return null for missing Retry-After header', () => {
    const response = new Response(null);
    expect(getRetryAfter(response)).toBe(null);
  });

  it('should return null for non-numeric Retry-After', () => {
    const response = new Response(null, {
      headers: { 'Retry-After': 'invalid' },
    });
    expect(getRetryAfter(response)).toBe(null);
  });

  it('should handle zero seconds', () => {
    const response = new Response(null, {
      headers: { 'Retry-After': '0' },
    });
    expect(getRetryAfter(response)).toBe(0);
  });
});
