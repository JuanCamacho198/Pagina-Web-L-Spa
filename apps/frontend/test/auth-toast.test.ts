import { describe, expect, test } from 'bun:test';
import { getAuthErrorMessageDescriptor } from '../src/lib/auth/auth-toast';

describe('auth toast error mapping', () => {
  test('maps login invalid credentials to localized key', () => {
    const descriptor = getAuthErrorMessageDescriptor('login', {
      code: 'INVALID_CREDENTIALS',
      status: 401,
      message: 'backend raw english text'
    });

    expect(descriptor).toEqual({
      key: 'auth.toast.login.error.invalidCredentials',
      fallback: 'We could not validate your credentials. Please try again.'
    });
  });

  test('maps login throttling and server errors predictably', () => {
    expect(getAuthErrorMessageDescriptor('login', { status: 429 }).key).toBe(
      'auth.toast.login.error.rateLimited'
    );

    expect(getAuthErrorMessageDescriptor('login', { status: 503 }).key).toBe(
      'auth.toast.login.error.server'
    );
  });

  test('maps register email conflicts and weak password', () => {
    expect(
      getAuthErrorMessageDescriptor('register', { code: 'EMAIL_ALREADY_EXISTS', status: 409 }).key
    ).toBe('auth.toast.register.error.emailInUse');

    expect(getAuthErrorMessageDescriptor('register', { code: 'WEAK_PASSWORD', status: 422 }).key).toBe(
      'auth.toast.register.error.weakPassword'
    );
  });

  test('falls back to generic keys without exposing raw message', () => {
    const loginDescriptor = getAuthErrorMessageDescriptor('login', {
      message: 'some unknown backend message'
    });
    const registerDescriptor = getAuthErrorMessageDescriptor('register', {
      message: 'another backend message'
    });

    expect(loginDescriptor.key).toBe('auth.toast.login.error.message');
    expect(registerDescriptor.key).toBe('auth.toast.register.error.message');
  });
});
