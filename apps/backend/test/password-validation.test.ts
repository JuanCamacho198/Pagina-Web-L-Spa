import { describe, expect, test } from 'bun:test';
import { passwordValidationSchema, getPasswordStrength } from '../src/auth/schemas/password.validation';
import { ZodError } from 'zod';

describe('Password Validation', () => {
  test('accepts valid password with all requirements', () => {
    const result = passwordValidationSchema.safeParse('SecurePass1!');
    expect(result.success).toBe(true);
  });

  test('rejects password shorter than 8 characters', () => {
    const result = passwordValidationSchema.safeParse('Short1!');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 8 characters');
    }
  });

  test('rejects password without uppercase', () => {
    const result = passwordValidationSchema.safeParse('nouppercase1!');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('uppercase');
    }
  });

  test('rejects password without lowercase', () => {
    const result = passwordValidationSchema.safeParse('NOLOWERCASE1!');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('lowercase');
    }
  });

  test('rejects password without number', () => {
    const result = passwordValidationSchema.safeParse('NoNumbers!');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('number');
    }
  });

  test('rejects password without special character', () => {
    const result = passwordValidationSchema.safeParse('NoSpecial1');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('special character');
    }
  });
});

describe('Password Strength Meter', () => {
  test('returns max score for strong password', () => {
    const result = getPasswordStrength('StrongPass1!');
    expect(result.score).toBe(5);
    expect(result.feedback).toHaveLength(0);
  });

  test('returns low score for weak password', () => {
    const result = getPasswordStrength('abc');
    expect(result.score).toBe(1);
    expect(result.feedback.length).toBeGreaterThan(0);
  });

  test('counts missing requirements', () => {
    const result = getPasswordStrength('password');
    expect(result.score).toBe(2);
    expect(result.feedback).toContain('Add uppercase letter');
    expect(result.feedback).toContain('Add number');
    expect(result.feedback).toContain('Add special character');
  });
});
