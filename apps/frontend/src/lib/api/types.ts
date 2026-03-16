export interface ApiClientConfig {
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
}

export interface RequestConfig extends RequestInit {
  retry?: boolean;
  retryConfig?: {
    maxAttempts?: number;
    baseDelay?: number;
  };
  throttle?: {
    maxConcurrent?: number;
    debounceMs?: number;
    maxQueue?: number;
  };
  skipAuth?: boolean;
}

export interface RateLimitConfig {
  maxConcurrent: number;
  debounceMs: number;
  maxQueue: number;
}

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
}
