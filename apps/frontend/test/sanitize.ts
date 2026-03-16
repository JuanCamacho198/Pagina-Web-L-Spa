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
