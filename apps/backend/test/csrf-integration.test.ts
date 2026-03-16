import { describe, it, expect, beforeEach } from 'bun:test';
import { Hono } from 'hono';
import { csrf } from '../src/middleware/csrf';

describe('CSRF Integration - Blocks Forged Requests', () => {
  let app: Hono;

  beforeEach(() => {
    app = new Hono();
  });

  it('should reject request without CSRF token in header', async () => {
    app.use(csrf());
    app.post('/api/test', (c) => c.json({ success: true }));

    const res = await app.request('http://localhost/api/test', {
      method: 'POST',
    });

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe('CSRF token missing');
  });

  it('should reject request with invalid CSRF token', async () => {
    app.use(csrf());
    app.post('/api/test', (c) => c.json({ success: true }));

    const res = await app.request('http://localhost/api/test', {
      method: 'POST',
      headers: {
        'x-csrf-token': 'invalid-forged-token',
      },
    });

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe('Invalid CSRF token');
  });

  it('should allow request with valid CSRF token', async () => {
    app.use(csrf());
    app.post('/api/test', (c) => c.json({ success: true }));

    const getRes = await app.request('http://localhost/api/test', {
      method: 'GET',
    });
    const setCookieHeader = getRes.headers.get('set-cookie') || '';
    const csrfToken = setCookieHeader.match(/csrf-token=([^;]+)/)?.[1];

    expect(csrfToken).toBeDefined();

    const postRes = await app.request('http://localhost/api/test', {
      method: 'POST',
      headers: {
        'x-csrf-token': csrfToken!,
        Cookie: `csrf-token=${csrfToken}`,
      },
    });

    expect(postRes.status).toBe(200);
  });

  it('should allow request with hash-validated token', async () => {
    app.use(csrf());
    app.post('/api/test', (c) => c.json({ success: true }));

    const getRes = await app.request('http://localhost/api/test', {
      method: 'GET',
    });
    const cookie = getRes.headers.get('set-cookie') || '';
    const csrfToken = cookie.match(/csrf-token=([^;]+)/)?.[1];

    expect(csrfToken).toBeDefined();

    const postRes = await app.request('http://localhost/api/test', {
      method: 'POST',
      headers: {
        'x-csrf-token': csrfToken!,
        Cookie: `csrf-token=${csrfToken}`,
      },
    });

    expect(postRes.status).toBe(200);
  });

  it('should skip CSRF check for GET requests', async () => {
    app.use(csrf());
    app.get('/api/test', (c) => c.json({ success: true }));

    const res = await app.request('http://localhost/api/test', {
      method: 'GET',
    });

    expect(res.status).toBe(200);
  });

  it('should skip CSRF check for OPTIONS requests', async () => {
    app.use(csrf());
    app.on('OPTIONS', '/api/test', (c) => c.text(''));

    const res = await app.request('http://localhost/api/test', {
      method: 'OPTIONS',
    });

    expect(res.status).toBe(200);
  });

  it('should regenerate token after each valid request', async () => {
    app.use(csrf());
    app.post('/api/test', (c) => c.json({ success: true }));

    const getRes = await app.request('http://localhost/api/test', {
      method: 'GET',
    });
    const cookie1 = getRes.headers.get('set-cookie') || '';
    const token1 = cookie1.match(/csrf-token=([^;]+)/)?.[1];

    const postRes1 = await app.request('http://localhost/api/test', {
      method: 'POST',
      headers: {
        'x-csrf-token': token1!,
        Cookie: `csrf-token=${token1}`,
      },
    });
    const cookie2 = postRes1.headers.get('set-cookie') || '';
    const token2 = cookie2.match(/csrf-token=([^;]+)/)?.[1];

    expect(token1).not.toBe(token2);
  });

  it('should block forged request from another origin', async () => {
    app.use(csrf());
    app.post('/api/test', (c) => c.json({ success: true }));

    const getRes = await app.request('http://localhost/api/test', {
      method: 'GET',
    });
    const cookie = getRes.headers.get('set-cookie') || '';
    const csrfToken = cookie.match(/csrf-token=([^;]+)/)?.[1];

    const forgedRes = await app.request('http://malicious-site.com/api/test', {
      method: 'POST',
      headers: {
        'x-csrf-token': csrfToken!,
        Cookie: `csrf-token=${csrfToken}`,
        Origin: 'http://malicious-site.com',
      },
    });

    expect(forgedRes.status).toBe(403);
  });
});
