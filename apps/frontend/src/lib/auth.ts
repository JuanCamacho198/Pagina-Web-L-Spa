/**
 * Auth compatibility layer.
 * The project migrated from Auth0 to Better Auth.
 * This file re-exports convenience helpers so existing imports keep working.
 */
import { writable, derived, get } from 'svelte/store';
import { authClient } from './auth-client';
import { browser } from '$app/environment';

// ---- Svelte stores for backwards compatibility ----
export const isAuthenticated = writable(false);
export const user = writable<{ name?: string; email?: string; image?: string } | null>(null);
export const isLoading = writable(true);

/**
 * Sync Better Auth session → legacy stores.
 * Call this once inside the root layout's onMount.
 */
export async function syncSession() {
  if (!browser) return;
  isLoading.set(true);
  try {
    const session = authClient.useSession();
    const data = session.get();
    if (data?.data) {
      isAuthenticated.set(true);
      user.set(data.data.user);
    } else {
      isAuthenticated.set(false);
      user.set(null);
    }
  } catch (e) {
    console.error('Error syncing session:', e);
    isAuthenticated.set(false);
    user.set(null);
  } finally {
    isLoading.set(false);
  }
}

/**
 * Redirect to login page
 */
export function login() {
  if (browser) {
    window.location.href = '/login';
  }
}

/**
 * Logout via Better Auth
 */
export async function logout() {
  await authClient.signOut();
  isAuthenticated.set(false);
  user.set(null);
  if (browser) {
    window.location.href = '/';
  }
}

/**
 * getToken — Better Auth uses cookies, so there's no standalone "token".
 * This is kept for backwards compat; it returns null.
 */
export async function getToken(): Promise<string | null> {
  return null;
}
