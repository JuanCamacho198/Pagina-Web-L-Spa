import { PUBLIC_API_URL } from '$env/static/public';

/**
 * @deprecated Use `createApiClient` from `$lib/api` instead.
 * 
 * This function is deprecated and will be removed in a future version.
 * 
 * Migration guide:
 * ```typescript
 * import { createApiClient } from '$lib/api';
 * 
 * const api = createApiClient({
 *   baseURL: 'http://localhost:3000/api/v1',
 * });
 * 
 * // Then use:
 * const data = await api.get('/endpoint');
 * const data = await api.post('/endpoint', body);
 * ```
 * 
 * Benefits of the new client:
 * - Automatic retry with exponential backoff
 * - Rate limiting and request queuing
 * - Typed errors
 * - Configurable timeout
 */
export async function apiFetch(path: string, options: RequestInit = {}) {
  console.warn(
    '[DEPRECATED] apiFetch is deprecated. Use createApiClient from $lib/api instead. ' +
    'See console for migration guide.'
  );
  
  const url = `${PUBLIC_API_URL || 'http://localhost:3000/api/v1'}${path}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}
