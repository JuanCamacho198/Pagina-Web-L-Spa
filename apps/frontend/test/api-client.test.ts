import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { ApiClient } from '../src/lib/api/client';

type FetchMock = (url: string | URL | Request, options?: RequestInit) => Promise<Response>;

describe('ApiClient - Integration Tests', () => {
  let mockFetch: FetchMock;

  beforeEach(() => {
    mockFetch = async (): Promise<Response> => {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (globalThis as any).fetch;
  });

  it('should handle Retry-After header on 429', async () => {
    let attempt = 0;

    mockFetch = async (): Promise<Response> => {
      attempt++;
      if (attempt === 1) {
        return new Response(null, { 
          status: 429,
          headers: { 'Retry-After': '1' }
        });
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com', timeout: 5000 });
    const startTime = Date.now();
    const result = await client.get<{ ok: boolean }>('/test', { retry: true, retryConfig: { baseDelay: 50 } });
    const elapsed = Date.now() - startTime;

    expect(result.ok).toBe(true);
    expect(attempt).toBe(2);
    expect(elapsed).toBeGreaterThanOrEqual(900);
  });

  it('should return typed response on success', async () => {
    mockFetch = async (): Promise<Response> => {
      return new Response(JSON.stringify({ 
        user: { id: 1, name: 'Test User', email: 'test@example.com' } 
      }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com' });
    const result = await client.get<{ user: { id: number; name: string; email: string } }>('/user');

    expect(result.user.id).toBe(1);
    expect(result.user.name).toBe('Test User');
    expect(result.user.email).toBe('test@example.com');
  });

  it('should parse error response body', async () => {
    mockFetch = async (): Promise<Response> => {
      return new Response(JSON.stringify({ 
        message: 'Invalid email format',
        details: { field: 'email', reason: 'missing @' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com' });

    try {
      await client.post('/user', { email: 'invalid' });
    } catch (error: any) {
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.message).toBe('Invalid email format');
      expect(error.details?.field).toBe('email');
    }
  });

  it('should handle POST request with body', async () => {
    let receivedBody: any = null;

    mockFetch = async (url: string | URL | Request, options?: RequestInit): Promise<Response> => {
      if (options?.body) {
        receivedBody = JSON.parse(options.body as string);
      }
      return new Response(JSON.stringify({ created: true }), { status: 201 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com' });
    const result = await client.post<{ created: boolean }>('/user', { name: 'John', email: 'john@example.com' });

    expect(result.created).toBe(true);
    expect(receivedBody.name).toBe('John');
    expect(receivedBody.email).toBe('john@example.com');
  });

  it('should handle PUT request with body', async () => {
    let receivedMethod = '';
    let receivedBody: any = null;

    mockFetch = async (url: string | URL | Request, options?: RequestInit): Promise<Response> => {
      receivedMethod = options?.method || 'GET';
      if (options?.body) {
        receivedBody = JSON.parse(options.body as string);
      }
      return new Response(JSON.stringify({ updated: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com' });
    const result = await client.put<{ updated: boolean }>('/user/1', { name: 'Jane' });

    expect(result.updated).toBe(true);
    expect(receivedMethod).toBe('PUT');
    expect(receivedBody.name).toBe('Jane');
  });

  it('should handle PATCH request with body', async () => {
    let receivedMethod = '';

    mockFetch = async (url: string | URL | Request, options?: RequestInit): Promise<Response> => {
      receivedMethod = options?.method || 'GET';
      return new Response(JSON.stringify({ patched: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com' });
    const result = await client.patch<{ patched: boolean }>('/user/1', { name: 'Updated' });

    expect(result.patched).toBe(true);
    expect(receivedMethod).toBe('PATCH');
  });

  it('should handle DELETE request', async () => {
    let receivedMethod = '';

    mockFetch = async (url: string | URL | Request, options?: RequestInit): Promise<Response> => {
      receivedMethod = options?.method || 'GET';
      return new Response(JSON.stringify({ deleted: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com' });
    const result = await client.delete<{ deleted: boolean }>('/user/1');

    expect(receivedMethod).toBe('DELETE');
    expect(result.deleted).toBe(true);
  });

  it('should include default headers', async () => {
    let receivedHeaders: Record<string, string> = {};

    mockFetch = async (url: string | URL | Request, options?: RequestInit): Promise<Response> => {
      receivedHeaders = options?.headers as Record<string, string> || {};
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ 
      baseURL: 'http://test.com',
      defaultHeaders: { 'X-Custom-Header': 'custom-value' }
    });
    await client.get('/test');

    expect(receivedHeaders['X-Custom-Header']).toBe('custom-value');
    expect(receivedHeaders['Content-Type']).toBe('application/json');
  });

  it('should always include credentials for authenticated APIs', async () => {
    let receivedCredentials: RequestCredentials | undefined;

    mockFetch = async (_url: string | URL | Request, options?: RequestInit): Promise<Response> => {
      receivedCredentials = options?.credentials;
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com' });
    await client.get('/secure-endpoint');

    expect(receivedCredentials).toBe('include');
  });

  it('should use custom headers', async () => {
    let receivedCustomHeader = false;

    mockFetch = async (url: string | URL | Request, options?: RequestInit): Promise<Response> => {
      const headers = options?.headers as Record<string, string> | undefined;
      if (headers && 'X-Custom' in headers && headers['X-Custom'] === 'custom') {
        receivedCustomHeader = true;
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com' });
    await client.get('/test', { headers: { 'X-Custom': 'custom' } });

    expect(receivedCustomHeader).toBe(true);
  });

  it('should handle timeout', async () => {
    mockFetch = async (): Promise<Response> => {
      await new Promise(r => setTimeout(r, 100));
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com', timeout: 10 });

    try {
      await client.get('/slow');
    } catch (error: any) {
      expect(error.code).toBe('NETWORK_ERROR');
      expect(error.message).toBe('Request timeout');
    }
  });

  it('should handle network failure', async () => {
    mockFetch = async (): Promise<Response> => {
      throw new Error('Failed to fetch');
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com' });

    try {
      await client.get('/test', { retry: false });
    } catch (error: any) {
      expect(error.code).toBe('NETWORK_ERROR');
    }
  });

  it('should handle full retry flow with exponential backoff', async () => {
    let attempt = 0;

    mockFetch = async (): Promise<Response> => {
      attempt++;
      if (attempt < 3) {
        return new Response(null, { status: 503 });
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com', timeout: 30000 });
    const result = await client.get<{ success: boolean }>('/test', { retry: true, retryConfig: { baseDelay: 50 } });

    expect(result.success).toBe(true);
    expect(attempt).toBe(3);
  });

  it('should handle concurrent retries with rate limiting', async () => {
    let requestCount = 0;

    mockFetch = async (): Promise<Response> => {
      requestCount++;
      if (requestCount <= 3) {
        return new Response(null, { status: 503 });
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com', timeout: 30000 });
    
    const results = await Promise.all([
      client.get('/test1', { retry: true, retryConfig: { maxAttempts: 4, baseDelay: 50 } }),
      client.get('/test2', { retry: true, retryConfig: { maxAttempts: 4, baseDelay: 50 } }),
      client.get('/test3', { retry: true, retryConfig: { maxAttempts: 4, baseDelay: 50 } }),
    ]);

    expect(results.every(r => (r as any).ok === true)).toBe(true);
  });
});
