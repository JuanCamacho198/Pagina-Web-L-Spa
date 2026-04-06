import type { ApiClientConfig, RequestConfig, RetryConfig, RateLimitConfig } from './types';
import type { AppError, ErrorCode } from '../errors/types';
import { createError, fromResponse, fromError, isRetryable, getRetryAfter } from '../errors/factory';
import type { AppointmentWithDetails } from '@l-spa/shared-types';

interface EndpointState {
  queue: Array<() => Promise<void>>;
  running: number;
}

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;
  private defaultRetryConfig: RetryConfig;
  private defaultRateLimitConfig: RateLimitConfig;
  private endpoints: Map<string, EndpointState>;

  constructor(config: ApiClientConfig = {}) {
    this.baseURL = config.baseURL || '';
    this.defaultHeaders = config.defaultHeaders || {};
    this.timeout = config.timeout || 30000;
    this.defaultRetryConfig = {
      maxAttempts: 3,
      baseDelay: 1000,
    };
    this.defaultRateLimitConfig = {
      maxConcurrent: 5,
      debounceMs: 300,
      maxQueue: 20,
    };
    this.endpoints = new Map();
  }

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('GET', url, undefined, config);
  }

  async post<T>(url: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>('POST', url, body, config);
  }

  async put<T>(url: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>('PUT', url, body, config);
  }

  async patch<T>(url: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>('PATCH', url, body, config);
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('DELETE', url, undefined, config);
  }

  async getUserAppointments(userId: string): Promise<AppointmentWithDetails[]> {
    return this.get<AppointmentWithDetails[]>(`/appointments/user/${userId}`);
  }

  private async request<T>(
    method: string,
    url: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const fullUrl = this.baseURL ? `${this.baseURL}${url}` : url;
    
    const retryEnabled = config?.retry ?? (method === 'GET');
    const retryConfig = {
      ...this.defaultRetryConfig,
      ...config?.retryConfig,
    };
    const rateLimitConfig = {
      ...this.defaultRateLimitConfig,
      ...config?.throttle,
    };

    const requestFn = async () => {
      return this.executeRequest<T>(fullUrl, method, body, {
        ...config,
        retry: retryEnabled,
        retryConfig,
      });
    };

    if (rateLimitConfig.maxConcurrent > 0) {
      return this.throttle<T>(fullUrl, requestFn, rateLimitConfig);
    }

    return requestFn();
  }

  private async throttle<T>(
    url: string,
    requestFn: () => Promise<T>,
    rateLimitConfig: RateLimitConfig
  ): Promise<T> {
    const endpoint = this.getOrCreateEndpoint(url);

    if (endpoint.running >= rateLimitConfig.maxConcurrent) {
      if (endpoint.queue.length >= rateLimitConfig.maxQueue) {
        throw createError(
          'RATE_LIMIT_ERROR',
          'Request queue full. Please try again later.',
          { maxQueue: rateLimitConfig.maxQueue }
        );
      }

      return new Promise((resolve, reject) => {
        endpoint.queue.push(async () => {
          try {
            const result = await requestFn();
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      });
    }

    endpoint.running++;

    try {
      const result = await requestFn();
      return result;
    } finally {
      endpoint.running--;
      this.processQueue(url);
    }
  }

  private getOrCreateEndpoint(url: string): EndpointState {
    const normalizedUrl = this.normalizeUrl(url);
    if (!this.endpoints.has(normalizedUrl)) {
      this.endpoints.set(normalizedUrl, {
        queue: [],
        running: 0,
      });
    }
    return this.endpoints.get(normalizedUrl)!;
  }

  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;
    } catch {
      return url;
    }
  }

  private processQueue(url: string): void {
    const normalizedUrl = this.normalizeUrl(url);
    const endpoint = this.endpoints.get(normalizedUrl);
    if (!endpoint || endpoint.queue.length === 0) {
      return;
    }

    const next = endpoint.queue.shift();
    if (next) {
      setTimeout(() => {
        endpoint.running++;
        next().finally(() => {
          endpoint.running--;
          this.processQueue(url);
        });
      }, this.defaultRateLimitConfig.debounceMs);
    }
  }

  private async executeRequest<T>(
    url: string,
    method: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const retryEnabled = config?.retry ?? true;
    const retryConfig = {
      ...this.defaultRetryConfig,
      ...config?.retryConfig,
    };

    let lastError: AppError | Error | unknown;
    let attempt = 0;

    while (attempt < retryConfig.maxAttempts) {
      attempt++;

      try {
        const response = await this.doFetch<T>(url, method, body, config);

        if (!response.ok) {
          const error = await fromResponse(response);

          if (response.status === 429) {
            const retryAfter = getRetryAfter(response);
            if (retryAfter) {
              if (attempt < retryConfig.maxAttempts) {
                await this.delay(retryAfter);
                continue;
              }
            }
          }

          if (retryEnabled && isRetryable(error) && attempt < retryConfig.maxAttempts) {
            const delay = this.calculateBackoff(attempt, retryConfig.baseDelay);
            await this.delay(delay);
            continue;
          }

          throw error;
        }

        return response.json();
      } catch (error) {
        lastError = error;

        if (error instanceof Error && !isRetryable(error)) {
          throw fromError(error);
        }

        if (retryEnabled && attempt < retryConfig.maxAttempts) {
          if (isRetryable(error)) {
            const delay = this.calculateBackoff(attempt, retryConfig.baseDelay);
            await this.delay(delay);
            continue;
          }
        }

        if (error instanceof Response) {
          throw fromResponse(error);
        }

        throw fromError(error);
      }
    }

    throw fromError(lastError);
  }

  private async doFetch<T>(
    url: string,
    method: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...this.defaultHeaders,
          ...config?.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        ...config,
      });

      return response;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw createError(
          'NETWORK_ERROR',
          'Request timeout',
          { timeout: this.timeout },
          error
        );
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private calculateBackoff(attempt: number, baseDelay: number): number {
    return Math.pow(2, attempt) * baseDelay;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export function createApiClient(config?: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}
