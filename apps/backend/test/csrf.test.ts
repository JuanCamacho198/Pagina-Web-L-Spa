import { describe, it, expect } from 'bun:test';
import { generateToken, verifyToken } from '../src/middleware/csrf-utils';

describe('CSRF Token Generation', () => {
  it('should generate a non-empty token', () => {
    const token = generateToken();
    expect(token).toBeDefined();
    expect(token.length).toBeGreaterThan(0);
  });

  it('should generate unique tokens each time', () => {
    const token1 = generateToken();
    const token2 = generateToken();
    expect(token1).not.toBe(token2);
  });

  it('should generate tokens of correct length', () => {
    const token = generateToken();
    expect(token.length).toBe(43);
  });

  it('should generate base64url encoded tokens', () => {
    const token = generateToken();
    const base64urlRegex = /^[A-Za-z0-9_-]+$/;
    expect(base64urlRegex.test(token)).toBe(true);
  });
});

describe('CSRF Token Validation', () => {
  it('should return true for matching tokens', () => {
    const token = generateToken();
    const isValid = verifyToken(token, token);
    expect(isValid).toBe(true);
  });

  it('should return false for non-matching tokens', () => {
    const token1 = generateToken();
    const token2 = generateToken();
    const isValid = verifyToken(token1, token2);
    expect(isValid).toBe(false);
  });

  it('should return false for empty cookie token', () => {
    const token = generateToken();
    const isValid = verifyToken('', token);
    expect(isValid).toBe(false);
  });

  it('should return false for empty header token', () => {
    const token = generateToken();
    const isValid = verifyToken(token, '');
    expect(isValid).toBe(false);
  });

  it('should return false for both empty tokens', () => {
    const isValid = verifyToken('', '');
    expect(isValid).toBe(false);
  });

  it('should validate using hash comparison for different tokens', () => {
    const token1 = generateToken();
    const token2 = token1;
    const isValid = verifyToken(token1, token2);
    expect(isValid).toBe(true);
  });

  it('should reject forged tokens', () => {
    const validToken = generateToken();
    const forgedToken = 'forged-token-12345';
    const isValid = verifyToken(validToken, forgedToken);
    expect(isValid).toBe(false);
  });
});
