import { describe, it, expect } from 'bun:test';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

const jsdom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
const purify = DOMPurify(jsdom.window as any);

export interface SanitizeOptions {
  stripBlankChars?: boolean;
  maxLength?: number;
}

export function sanitizeHtml(dirty: string, options?: SanitizeOptions): string {
  let clean = dirty;

  if (options?.maxLength && clean.length > options.maxLength) {
    clean = clean.slice(0, options.maxLength);
  }

  if (options?.stripBlankChars) {
    clean = clean.replace(/[\x00-\x1F\x7F]/g, '');
  }

  return purify.sanitize(clean, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}

export function sanitizeInput(input: unknown): string {
  if (typeof input === 'string') {
    return purify.sanitize(input, { RETURN_TRUSTED_TYPE: false });
  }
  if (typeof input === 'number' || typeof input === 'boolean') {
    return String(input);
  }
  return '';
}

describe('Sanitize - XSS Payloads', () => {
  const xssPayloads = [
    '<script>alert(1)</script>',
    '<img src=x onerror=alert(1)>',
    '<svg onload=alert(1)>',
    '<iframe src="javascript:alert(1)">',
    '<body onload=alert(1)>',
    '<input onfocus=alert(1) autofocus>',
    '<svg><animate onbegin=alert(1)>',
    '<div style="background-image:url(javascript:alert(1))">',
  ];

  xssPayloads.forEach((payload) => {
    it(`should strip XSS payload: ${payload.slice(0, 30)}`, () => {
      const result = sanitizeHtml(payload);
      expect(result).not.toContain('<script');
      expect(result).not.toContain('onerror');
      expect(result).not.toContain('onload');
      expect(result).not.toContain('javascript:');
      expect(result).not.toContain('onload');
    });
  });

  it('should strip script tags completely', () => {
    const input = '<p>Hello</p><script>alert(1)</script>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain('<script>');
    expect(result).toContain('<p>Hello</p>');
  });

  it('should strip img onerror attribute', () => {
    const input = '<img src=x onerror=alert(1)>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain('onerror');
  });

  it('should strip svg onload attribute', () => {
    const input = '<svg onload=alert(1)></svg>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain('onload');
  });

  it('should allow safe HTML tags', () => {
    const input = '<p><strong>Hello</strong> <em>World</em></p>';
    const result = sanitizeHtml(input);
    expect(result).toContain('<p>');
    expect(result).toContain('<strong>');
    expect(result).toContain('<em>');
  });

  it('should allow safe attributes', () => {
    const input = '<a href="https://example.com" target="_blank">Link</a>';
    const result = sanitizeHtml(input);
    expect(result).toContain('href="https://example.com"');
    expect(result).toContain('target="_blank"');
  });

  it('should preserve plain text (javascript: as text)', () => {
    const input = 'javascript:alert(1)';
    const result = sanitizeHtml(input);
    expect(result).toBe('javascript:alert(1)');
  });

  it('should strip unsafe attributes', () => {
    const input = '<a href="javascript:alert(1)" onclick="alert(1)">Link</a>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain('javascript:');
    expect(result).not.toContain('onclick');
  });
});

describe('Sanitize - Options', () => {
  it('should truncate content to maxLength', () => {
    const input = 'a'.repeat(100);
    const result = sanitizeHtml(input, { maxLength: 50 });
    expect(result.length).toBe(50);
  });

  it('should strip blank characters when option is enabled', () => {
    const input = 'hello\x00world\x1Ftest';
    const result = sanitizeHtml(input, { stripBlankChars: true });
    expect(result).not.toContain('\x00');
    expect(result).not.toContain('\x1F');
  });
});

describe('SanitizeInput', () => {
  it('should sanitize string input', () => {
    const input = '<script>alert(1)</script>Hello';
    const result = sanitizeInput(input);
    expect(result).not.toContain('<script>');
  });

  it('should convert numbers to string', () => {
    const input = 123;
    const result = sanitizeInput(input);
    expect(result).toBe('123');
  });

  it('should convert booleans to string', () => {
    const input = true;
    const result = sanitizeInput(input);
    expect(result).toBe('true');
  });

  it('should return empty string for invalid input', () => {
    const input = null;
    const result = sanitizeInput(input);
    expect(result).toBe('');
  });
});
