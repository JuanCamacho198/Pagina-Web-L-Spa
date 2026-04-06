export type AppRole = 'admin' | 'employee' | 'customer';
export type AccessScope = 'admin' | 'staff';
export type AccessReason = 'ok' | 'unauthenticated' | 'forbidden';

function normalizeRole(role: unknown): AppRole | null {
  if (role === 'admin' || role === 'employee' || role === 'customer') {
    return role;
  }

  return null;
}

export function canAccessAdmin(role: unknown): boolean {
  return normalizeRole(role) === 'admin';
}

export function canAccessStaff(role: unknown): boolean {
  const normalized = normalizeRole(role);
  return normalized === 'admin' || normalized === 'employee';
}

export function getRbacDecision(
  scope: AccessScope,
  role: unknown,
  isAuthenticated: boolean
): { authorized: boolean; reason: AccessReason } {
  if (!isAuthenticated) {
    return { authorized: false, reason: 'unauthenticated' };
  }

  const authorized = scope === 'admin' ? canAccessAdmin(role) : canAccessStaff(role);
  return { authorized, reason: authorized ? 'ok' : 'forbidden' };
}
