import { describe, it, expect, beforeEach } from 'bun:test';
import { Hono } from 'hono';
import { csrf } from '../src/middleware/csrf';
import { cors } from 'hono/cors';

describe('CSRF Integration - Middleware Behavior', () => {
  let app: Hono;

  beforeEach(() => {
    app = new Hono();
    app.use('*', cors());
  });

  it('should allow POST request without existing cookie (first request)', async () => {
    app.use(csrf());
    app.post('/api/test', (c) => c.json({ success: true }));

    const res = await app.request('http://localhost/api/test', {
      method: 'POST',
    });

    expect(res.status).toBe(200);
    expect(res.headers.get('set-cookie')).toContain('csrf-token=');
  });

  it('should reject POST with invalid cookie token', async () => {
    app.use(csrf());
    app.post('/api/test', (c) => c.json({ success: true }));

    const res = await app.request('http://localhost/api/test', {
      method: 'POST',
      headers: { 
        'x-csrf-token': 'invalid-token',
        Cookie: 'csrf-token=some-cookie-value'
      },
    });

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe('Invalid CSRF token');
  });

  it('should skip CSRF check for GET requests', async () => {
    app.use(csrf());
    app.get('/api/test', (c) => c.json({ success: true }));

    const res = await app.request('http://localhost/api/test', { method: 'GET' });
    expect(res.status).toBe(200);
  });

  it('should skip CSRF check for HEAD requests', async () => {
    app.use(csrf());
    app.get('/api/test', (c) => c.text(''));

    const res = await app.request('http://localhost/api/test', { method: 'HEAD' });
    expect(res.status).toBe(200);
  });

  it('should skip CSRF check for OPTIONS requests', async () => {
    app.use(csrf());
    app.on('OPTIONS', '/api/test', (c) => c.text(''));

    const res = await app.request('http://localhost/api/test', { method: 'OPTIONS' });
    expect(res.status).toBe(204);
  });

  it('should reject DELETE with invalid CSRF token cookie', async () => {
    app.use(csrf());
    app.delete('/api/test', (c) => c.json({ success: true }));

    const res = await app.request('http://localhost/api/test', { 
      method: 'DELETE',
      headers: { Cookie: 'csrf-token=invalid-cookie' }
    });
    expect(res.status).toBe(403);
  });

  it('should reject PUT with invalid CSRF token cookie', async () => {
    app.use(csrf());
    app.put('/api/test', (c) => c.json({ success: true }));

    const res = await app.request('http://localhost/api/test', { 
      method: 'PUT',
      headers: { Cookie: 'csrf-token=invalid-cookie' }
    });
    expect(res.status).toBe(403);
  });

  it('should reject POST without token header when cookie exists', async () => {
    app.use(csrf());
    app.post('/api/test', (c) => c.json({ success: true }));

    const res = await app.request('http://localhost/api/test', { 
      method: 'POST',
      headers: { Cookie: 'csrf-token=some-cookie-value' }
    });
    expect(res.status).toBe(403);
  });
});
