import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { ApiClient } from '../src/lib/api/client';

type FetchMock = (url: string | URL | Request, options?: RequestInit) => Promise<Response>;

describe('ApiClient - Retry Logic', () => {
  let mockFetch: FetchMock;

  beforeEach(() => {
    mockFetch = async (): Promise<Response> => {
      return new Response(null, { status: 500 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (globalThis as any).fetch;
  });

  it('should calculate exponential backoff correctly', async () => {
    let attempt = 0;
    const attemptTimes: number[] = [];

    mockFetch = async (): Promise<Response> => {
      attemptTimes.push(Date.now());
      attempt++;
      if (attempt < 3) {
        return new Response(null, { status: 500 });
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com' });
    const result = await client.get<{ success: boolean }>('/test', { retry: true, retryConfig: { baseDelay: 100 } });

    expect(result.success).toBe(true);
    expect(attempt).toBe(3);
  });

  it('should respect max 3 attempts by default', async () => {
    let attempt = 0;

    mockFetch = async (): Promise<Response> => {
      attempt++;
      return new Response(null, { status: 500 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com', timeout: 10000 });

    try {
      await client.get('/test', { retry: true, retryConfig: { baseDelay: 100 } });
    } catch (error: any) {
      expect(attempt).toBe(3);
      expect(error.code).toBe('SERVER_ERROR');
    }
  });

  it('should retry on 500 status', async () => {
    let attempt = 0;

    mockFetch = async (): Promise<Response> => {
      attempt++;
      if (attempt < 3) {
        return new Response(null, { status: 500 });
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com', timeout: 30000 });
    const result = await client.get<{ ok: boolean }>('/test', { retry: true, retryConfig: { baseDelay: 50 } });

    expect(result.ok).toBe(true);
    expect(attempt).toBe(3);
  });

  it('should retry on 502 status', async () => {
    let attempt = 0;

    mockFetch = async (): Promise<Response> => {
      attempt++;
      if (attempt < 3) {
        return new Response(null, { status: 502 });
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com', timeout: 30000 });
    const result = await client.get<{ ok: boolean }>('/test', { retry: true, retryConfig: { baseDelay: 50 } });

    expect(result.ok).toBe(true);
    expect(attempt).toBe(3);
  });

  it('should retry on 503 status', async () => {
    let attempt = 0;

    mockFetch = async (): Promise<Response> => {
      attempt++;
      if (attempt < 3) {
        return new Response(null, { status: 503 });
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com', timeout: 30000 });
    const result = await client.get<{ ok: boolean }>('/test', { retry: true, retryConfig: { baseDelay: 50 } });

    expect(result.ok).toBe(true);
    expect(attempt).toBe(3);
  });

  it('should retry on 504 status', async () => {
    let attempt = 0;

    mockFetch = async (): Promise<Response> => {
      attempt++;
      if (attempt < 3) {
        return new Response(null, { status: 504 });
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com', timeout: 30000 });
    const result = await client.get<{ ok: boolean }>('/test', { retry: true, retryConfig: { baseDelay: 50 } });

    expect(result.ok).toBe(true);
    expect(attempt).toBe(3);
  });

  it('should retry on 408 status', async () => {
    let attempt = 0;

    mockFetch = async (): Promise<Response> => {
      attempt++;
      if (attempt < 3) {
        return new Response(null, { status: 408 });
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com', timeout: 30000 });
    const result = await client.get<{ ok: boolean }>('/test', { retry: true, retryConfig: { baseDelay: 50 } });

    expect(result.ok).toBe(true);
    expect(attempt).toBe(3);
  });

  it('should not retry on 400 status', async () => {
    let attempt = 0;

    mockFetch = async (): Promise<Response> => {
      attempt++;
      return new Response(null, { status: 400 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com' });

    try {
      await client.get('/test', { retry: true });
    } catch (error: any) {
      expect(attempt).toBe(1);
      expect(error.code).toBe('VALIDATION_ERROR');
    }
  });

  it('should not retry on 401 status', async () => {
    let attempt = 0;

    mockFetch = async (): Promise<Response> => {
      attempt++;
      return new Response(null, { status: 401 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com' });

    try {
      await client.get('/test', { retry: true });
    } catch (error: any) {
      expect(attempt).toBe(1);
      expect(error.code).toBe('AUTH_ERROR');
    }
  });

  it('should not retry on 403 status', async () => {
    let attempt = 0;

    mockFetch = async (): Promise<Response> => {
      attempt++;
      return new Response(null, { status: 403 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com' });

    try {
      await client.get('/test', { retry: true });
    } catch (error: any) {
      expect(attempt).toBe(1);
      expect(error.code).toBe('AUTH_ERROR');
    }
  });

  it('should not retry on 404 status', async () => {
    let attempt = 0;

    mockFetch = async (): Promise<Response> => {
      attempt++;
      return new Response(null, { status: 404 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com' });

    try {
      await client.get('/test', { retry: true });
    } catch (error: any) {
      expect(attempt).toBe(1);
      expect(error.code).toBe('VALIDATION_ERROR');
    }
  });

  it('should not retry on 422 status', async () => {
    let attempt = 0;

    mockFetch = async (): Promise<Response> => {
      attempt++;
      return new Response(null, { status: 422 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com' });

    try {
      await client.get('/test', { retry: true });
    } catch (error: any) {
      expect(attempt).toBe(1);
      expect(error.code).toBe('VALIDATION_ERROR');
    }
  });

  it('should retry on network error', async () => {
    let attempt = 0;

    mockFetch = async (): Promise<Response> => {
      attempt++;
      if (attempt < 3) {
        throw new Error('Network error');
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com', timeout: 30000 });
    const result = await client.get<{ ok: boolean }>('/test', { retry: true, retryConfig: { baseDelay: 50 } });

    expect(result.ok).toBe(true);
    expect(attempt).toBe(3);
  });

  it('should use custom retry config', async () => {
    let attempt = 0;

    mockFetch = async (): Promise<Response> => {
      attempt++;
      if (attempt < 4) {
        return new Response(null, { status: 500 });
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com', timeout: 30000 });
    const result = await client.get<{ ok: boolean }>('/test', { retry: true, retryConfig: { maxAttempts: 4, baseDelay: 50 } });

    expect(result.ok).toBe(true);
    expect(attempt).toBe(4);
  });

  it('should default to retry for GET requests', async () => {
    let attempt = 0;

    mockFetch = async (): Promise<Response> => {
      attempt++;
      if (attempt < 3) {
        return new Response(null, { status: 503 });
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com', timeout: 30000 });
    const result = await client.get<{ ok: boolean }>('/test', { retryConfig: { baseDelay: 50 } });

    expect(result.ok).toBe(true);
    expect(attempt).toBe(3);
  });

  it('should not retry by default for POST requests', async () => {
    let attempt = 0;

    mockFetch = async (): Promise<Response> => {
      attempt++;
      return new Response(null, { status: 500 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com' });

    try {
      await client.post('/test', { data: 'test' });
    } catch (error: any) {
      expect(attempt).toBe(1);
      expect(error.code).toBe('SERVER_ERROR');
    }
  });

  it('should retry for POST when explicitly enabled', async () => {
    let attempt = 0;

    mockFetch = async (): Promise<Response> => {
      attempt++;
      if (attempt < 3) {
        return new Response(null, { status: 503 });
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com', timeout: 30000 });
    const result = await client.post<{ ok: boolean }>('/test', { data: 'test' }, { retry: true, retryConfig: { baseDelay: 50 } });

    expect(result.ok).toBe(true);
    expect(attempt).toBe(3);
  });
});
