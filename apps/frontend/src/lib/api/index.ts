export { ApiClient, createApiClient } from './client';
export type { ApiClientConfig, RequestConfig, RateLimitConfig, RetryConfig } from './types';

// Default client instance for easy migration
import { createApiClient as createClient } from './client';
import { PUBLIC_API_URL } from '$env/static/public';

export const apiClient = createClient({
  baseURL: PUBLIC_API_URL || 'http://localhost:3000/api/v1'
});
