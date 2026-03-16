import { describe, it, expect, beforeEach } from 'bun:test';
import { securityHeaders, buildCSP, generateNonce } from '../src/middleware/security-headers';
import { Hono } from 'hono';

describe('Security Headers Middleware', () => {
  let app: Hono;

  beforeEach(() => {
    app = new Hono();
  });

  it('should set Content-Security-Policy header', async () => {
    app.use(securityHeaders());
    app.get('/', (c) => c.text('Hello'));

    const res = await app.request('http://localhost/');
    const csp = res.headers.get('Content-Security-Policy');
    
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self'");
  });

  it('should set HSTS header', async () => {
    app.use(securityHeaders());
    app.get('/', (c) => c.text('Hello'));

    const res = await app.request('http://localhost/');
    const hsts = res.headers.get('Strict-Transport-Security');
    
    expect(hsts).toBeDefined();
    expect(hsts).toContain('max-age=31536000');
    expect(hsts).toContain('includeSubDomains');
    expect(hsts).toContain('preload');
  });

  it('should set X-Frame-Options to DENY by default', async () => {
    app.use(securityHeaders());
    app.get('/', (c) => c.text('Hello'));

    const res = await app.request('http://localhost/');
    const xfo = res.headers.get('X-Frame-Options');
    
    expect(xfo).toBe('DENY');
  });

  it('should set X-Frame-Options to SAMEORIGIN when configured', async () => {
    app.use(securityHeaders({ xFrameOptions: 'SAMEORIGIN' }));
    app.get('/', (c) => c.text('Hello'));

    const res = await app.request('http://localhost/');
    const xfo = res.headers.get('X-Frame-Options');
    
    expect(xfo).toBe('SAMEORIGIN');
  });

  it('should set X-Content-Type-Options to nosniff', async () => {
    app.use(securityHeaders());
    app.get('/', (c) => c.text('Hello'));

    const res = await app.request('http://localhost/');
    const xcto = res.headers.get('X-Content-Type-Options');
    
    expect(xcto).toBe('nosniff');
  });

  it('should set Referrer-Policy', async () => {
    app.use(securityHeaders());
    app.get('/', (c) => c.text('Hello'));

    const res = await app.request('http://localhost/');
    const referrer = res.headers.get('Referrer-Policy');
    
    expect(referrer).toBe('strict-origin-when-cross-origin');
  });

  it('should set Permissions-Policy', async () => {
    app.use(securityHeaders());
    app.get('/', (c) => c.text('Hello'));

    const res = await app.request('http://localhost/');
    const perms = res.headers.get('Permissions-Policy');
    
    expect(perms).toContain('camera=()');
    expect(perms).toContain('microphone=()');
    expect(perms).toContain('geolocation=()');
  });

  it('should set X-Permitted-Cross-Domain-Policies', async () => {
    app.use(securityHeaders());
    app.get('/', (c) => c.text('Hello'));

    const res = await app.request('http://localhost/');
    const crossDomain = res.headers.get('X-Permitted-Cross-Domain-Policies');
    
    expect(crossDomain).toBe('none');
  });

  it('should include nonce in CSP', async () => {
    app.use(securityHeaders());
    app.get('/', (c) => c.text('Hello'));

    const res = await app.request('http://localhost/');
    const csp = res.headers.get('Content-Security-Policy');
    
    expect(csp).toMatch(/script-src.*'nonce-/);
  });

  it('should allow custom CSP configuration', async () => {
    app.use(securityHeaders({
      csp: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'nonce-'"],
        imgSrc: ['https://img.example.com'],
      }
    }));
    app.get('/', (c) => c.text('Hello'));

    const res = await app.request('http://localhost/');
    const csp = res.headers.get('Content-Security-Policy');
    
    expect(csp).toContain('img-src https://img.example.com');
  });

  it('should disable CSP when explicitly set to false', async () => {
    app.use(securityHeaders({ csp: false }));
    app.get('/', (c) => c.text('Hello'));

    const res = await app.request('http://localhost/');
    const csp = res.headers.get('Content-Security-Policy');
    
    expect(csp).toBeNull();
  });

  it('should disable HSTS when explicitly set to false', async () => {
    app.use(securityHeaders({ hsts: false }));
    app.get('/', (c) => c.text('Hello'));

    const res = await app.request('http://localhost/');
    const hsts = res.headers.get('Strict-Transport-Security');
    
    expect(hsts).toBeNull();
  });
});

describe('buildCSP', () => {
  it('should build CSP with default values', () => {
    const nonce = 'test-nonce-123';
    const csp = buildCSP(undefined, nonce);
    
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain(`script-src 'self' 'nonce-${nonce}'`);
    expect(csp).toContain("style-src 'self' 'unsafe-inline' https://fonts.googleapis.com");
  });

  it('should build CSP with custom configuration', () => {
    const nonce = 'test-nonce';
    const config = {
      defaultSrc: ["'self'", 'https://example.com'],
      imgSrc: ['data:', 'https://img.example.com'],
    };
    const csp = buildCSP(config, nonce);
    
    expect(csp).toContain("default-src 'self' https://example.com");
    expect(csp).toContain('img-src data: https://img.example.com');
  });
});

describe('generateNonce', () => {
  it('should generate unique nonces', () => {
    const nonce1 = generateNonce();
    const nonce2 = generateNonce();
    expect(nonce1).not.toBe(nonce2);
  });

  it('should generate base64url encoded nonces', () => {
    const nonce = generateNonce();
    const base64urlRegex = /^[A-Za-z0-9_-]+$/;
    expect(base64urlRegex.test(nonce)).toBe(true);
  });
});
