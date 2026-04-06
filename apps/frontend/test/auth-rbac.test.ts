import { describe, expect, test } from 'bun:test';
import { canAccessAdmin, canAccessStaff, getRbacDecision } from '../src/lib/auth/rbac';

describe('frontend RBAC matrix', () => {
  test('admin scope allows only admin role', () => {
    expect(canAccessAdmin('admin')).toBe(true);
    expect(canAccessAdmin('employee')).toBe(false);
    expect(canAccessAdmin('customer')).toBe(false);
    expect(canAccessAdmin(undefined)).toBe(false);
  });

  test('staff scope allows employee and admin', () => {
    expect(canAccessStaff('admin')).toBe(true);
    expect(canAccessStaff('employee')).toBe(true);
    expect(canAccessStaff('customer')).toBe(false);
    expect(canAccessStaff('unknown')).toBe(false);
  });

  test('decision reason matrix is deterministic', () => {
    expect(getRbacDecision('admin', 'admin', true)).toEqual({ authorized: true, reason: 'ok' });
    expect(getRbacDecision('staff', 'admin', true)).toEqual({ authorized: true, reason: 'ok' });
    expect(getRbacDecision('staff', 'employee', true)).toEqual({ authorized: true, reason: 'ok' });
    expect(getRbacDecision('staff', 'customer', true)).toEqual({ authorized: false, reason: 'forbidden' });
    expect(getRbacDecision('admin', null, false)).toEqual({ authorized: false, reason: 'unauthenticated' });
  });
});
