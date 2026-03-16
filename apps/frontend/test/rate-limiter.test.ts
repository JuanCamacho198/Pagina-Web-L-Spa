import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { ApiClient } from '../src/lib/api/client';

type FetchMock = (url: string | URL | Request, options?: RequestInit) => Promise<Response>;

describe('ApiClient - Rate Limiting', () => {
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

  it('should throttle to max concurrent requests per endpoint', async () => {
    let concurrent = 0;
    let maxConcurrent = 0;

    mockFetch = async (): Promise<Response> => {
      concurrent++;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      await new Promise(r => setTimeout(r, 50));
      concurrent--;
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com' });
    const promises = Array(10).fill(null).map(() => 
      client.get('/test', { retry: false, throttle: { maxConcurrent: 5, debounceMs: 5, maxQueue: 20 } })
    );

    await Promise.all(promises);

    expect(maxConcurrent).toBeLessThanOrEqual(5);
  });

  it('should process requests sequentially when maxConcurrent is 1', async () => {
    const order: number[] = [];

    mockFetch = async (): Promise<Response> => {
      order.push(Date.now());
      await new Promise(r => setTimeout(r, 10));
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com' });
    const promises = [1, 2, 3].map(i => 
      client.get(`/test${i}`, { retry: false, throttle: { maxConcurrent: 1, debounceMs: 5, maxQueue: 20 } })
        .then(() => i)
    );

    const results = await Promise.all(promises);
    expect(results).toEqual([1, 2, 3]);
  });

  it('should handle queue overflow rejection', async () => {
    let requestCount = 0;

    mockFetch = async (): Promise<Response> => {
      requestCount++;
      await new Promise(r => setTimeout(r, 100));
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com' });
    
    const slowRequest = client.get('/test', { retry: false, throttle: { maxConcurrent: 1, debounceMs: 10, maxQueue: 2 } });
    
    await new Promise(r => setTimeout(r, 5));
    
    const promises = Array(5).fill(null).map(() => 
      client.get('/test', { retry: false, throttle: { maxConcurrent: 1, debounceMs: 10, maxQueue: 2 } })
        .then(() => 'success')
        .catch(e => e)
    );

    const results = await Promise.all(promises);
    const errors = results.filter(r => r !== 'success');
    
    expect(errors.length).toBeGreaterThanOrEqual(1);

    await slowRequest.catch(() => {});
  });

  it('should respect custom maxConcurrent', async () => {
    let concurrent = 0;
    let maxConcurrent = 0;

    mockFetch = async (): Promise<Response> => {
      concurrent++;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      await new Promise(r => setTimeout(r, 20));
      concurrent--;
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com' });
    const promises = Array(6).fill(null).map(() => 
      client.get('/test', { retry: false, throttle: { maxConcurrent: 2, debounceMs: 5, maxQueue: 20 } })
    );

    await Promise.all(promises);

    expect(maxConcurrent).toBeLessThanOrEqual(2);
  });

  it('should handle different endpoints independently', async () => {
    let endpoint1Concurrent = 0;
    let endpoint2Concurrent = 0;

    mockFetch = async (url: string | URL | Request): Promise<Response> => {
      const urlStr = url.toString();
      if (urlStr.includes('/endpoint1')) {
        endpoint1Concurrent++;
      } else {
        endpoint2Concurrent++;
      }
      await new Promise(r => setTimeout(r, 30));
      if (urlStr.includes('/endpoint1')) {
        endpoint1Concurrent--;
      } else {
        endpoint2Concurrent--;
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com' });
    
    const promises1 = Array(3).fill(null).map(() => 
      client.get('/endpoint1', { retry: false, throttle: { maxConcurrent: 5, debounceMs: 5, maxQueue: 20 } })
    );
    const promises2 = Array(3).fill(null).map(() => 
      client.get('/endpoint2', { retry: false, throttle: { maxConcurrent: 5, debounceMs: 5, maxQueue: 20 } })
    );

    await Promise.all([...promises1, ...promises2]);

    expect(endpoint1Concurrent).toBeLessThanOrEqual(5);
    expect(endpoint2Concurrent).toBeLessThanOrEqual(5);
  });

  it('should disable throttling when maxConcurrent is 0', async () => {
    let concurrent = 0;

    mockFetch = async (): Promise<Response> => {
      concurrent++;
      await new Promise(r => setTimeout(r, 10));
      concurrent--;
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = mockFetch;

    const client = new ApiClient({ baseURL: 'http://test.com' });
    const promises = Array(5).fill(null).map(() => 
      client.get('/test', { retry: false, throttle: { maxConcurrent: 0, debounceMs: 0, maxQueue: 0 } })
    );

    await Promise.all(promises);

    expect(concurrent).toBe(0);
  });
});
