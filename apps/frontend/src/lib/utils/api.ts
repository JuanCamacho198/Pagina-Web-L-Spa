import { PUBLIC_API_URL } from '$env/static/public';

/**
 * Helper to fetch from the Hono Backend API.
 * Uses PUBLIC_API_URL from environment variables.
 */
export async function apiFetch(path: string, options: RequestInit = {}) {
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
