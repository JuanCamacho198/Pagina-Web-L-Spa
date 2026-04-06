import { describe, expect, test } from 'bun:test';
import { RolesGuard } from '../src/auth/roles.guard';

function mockExecutionContext(roles: string[] | undefined, userRole: string | undefined): any {
  return {
    getHandler: () => 'handler',
    getClass: () => 'class',
    switchToHttp: () => ({
      getRequest: () => ({
        user: userRole ? { role: userRole } : undefined,
      }),
    }),
    __roles: roles,
  };
}

describe('RolesGuard RBAC matrix', () => {
  const reflector = {
    getAllAndOverride: (_key: string, [handler, klass]: [unknown, unknown]) => {
      void handler;
      void klass;
      return (globalThis as any).__testRoles as string[] | undefined;
    },
  };

  test('allows when no roles metadata', () => {
    (globalThis as any).__testRoles = undefined;
    const guard = new RolesGuard(reflector as any);
    const ctx = mockExecutionContext(undefined, undefined);
    expect(guard.canActivate(ctx)).toBe(true);
  });

  test('allows admin for admin-only endpoints', () => {
    (globalThis as any).__testRoles = ['admin'];
    const guard = new RolesGuard(reflector as any);
    const ctx = mockExecutionContext(['admin'], 'admin');
    expect(guard.canActivate(ctx)).toBe(true);
  });

  test('rejects employee for admin-only endpoints', () => {
    (globalThis as any).__testRoles = ['admin'];
    const guard = new RolesGuard(reflector as any);
    const ctx = mockExecutionContext(['admin'], 'employee');
    expect(() => guard.canActivate(ctx)).toThrow('Insufficient role permissions');
  });

  test('allows employee for staff endpoints', () => {
    (globalThis as any).__testRoles = ['employee', 'admin'];
    const guard = new RolesGuard(reflector as any);
    const ctx = mockExecutionContext(['employee', 'admin'], 'employee');
    expect(guard.canActivate(ctx)).toBe(true);
  });

  test('rejects customer for staff endpoints', () => {
    (globalThis as any).__testRoles = ['employee', 'admin'];
    const guard = new RolesGuard(reflector as any);
    const ctx = mockExecutionContext(['employee', 'admin'], 'customer');
    expect(() => guard.canActivate(ctx)).toThrow('Insufficient role permissions');
  });
});
