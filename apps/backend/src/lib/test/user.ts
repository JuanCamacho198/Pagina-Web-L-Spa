import { db } from '@l-spa/database';
import { user, session, account } from '@l-spa/database';
import { eq } from '@l-spa/database';

export interface TestUser {
  id: string;
  email: string;
  password: string;
  name: string;
}

export const TEST_USER_EMAIL = 'test@example.com';
export const TEST_USER_PASSWORD = 'TestPassword123!';

export async function createTestUser(): Promise<TestUser> {
  const testUserId = `test-user-${Date.now()}`;
  const testEmail = TEST_USER_EMAIL;
  const testPassword = TEST_USER_PASSWORD;
  const testName = 'Test User';

  const sessionId = `test-session-${Date.now()}`;
  const sessionToken = `test-token-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db.insert(user).values({
    id: testUserId,
    name: testName,
    email: testEmail,
    emailVerified: true,
    image: null,
    firstName: 'Test',
    lastName: 'User',
    role: 'customer',
  });

  await db.insert(session).values({
    id: sessionId,
    expiresAt,
    token: sessionToken,
    userId: testUserId,
  });

  await db.insert(account).values({
    id: `test-account-${Date.now()}`,
    accountId: testUserId,
    providerId: 'credential',
    userId: testUserId,
    password: testPassword,
  });

  return {
    id: testUserId,
    email: testEmail,
    password: testPassword,
    name: testName,
  };
}

export async function cleanupTestUser(userId: string): Promise<void> {
  await db.delete(account).where(eq(account.userId, userId));
  await db.delete(session).where(eq(session.userId, userId));
  await db.delete(user).where(eq(user.id, userId));
}