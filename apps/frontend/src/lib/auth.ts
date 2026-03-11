import { createAuth0Client, type Auth0Client, type User } from '@auth0/auth0-spa-js';
import { writable } from 'svelte/store';
import { PUBLIC_AUTH0_DOMAIN, PUBLIC_AUTH0_CLIENT_ID, PUBLIC_AUTH0_AUDIENCE } from '$env/static/public';
import { browser } from '$app/environment';

export const isAuthenticated = writable(false);
export const user = writable<User | null>(null);
export const isLoading = writable(true);
export const auth0Client = writable<Auth0Client | null>(null);

let client: Auth0Client;

/**
 * Initializes the Auth0 client and sets up the session state.
 */
export async function initAuth() {
	if (!browser) return;

	isLoading.set(true);

	try {
		client = await createAuth0Client({
			domain: PUBLIC_AUTH0_DOMAIN,
			clientId: PUBLIC_AUTH0_CLIENT_ID,
			authorizationParams: {
				audience: PUBLIC_AUTH0_AUDIENCE,
				redirect_uri: window.location.origin
			},
			cacheLocation: 'localstorage',
			useRefreshTokens: true
		});

		auth0Client.set(client);

		// Handle completion of login flow
		const query = window.location.search;
		if (query.includes('code=') && query.includes('state=')) {
			await client.handleRedirectCallback();
			window.history.replaceState({}, document.title, window.location.pathname);
		}

		const isAuth = await client.isAuthenticated();
		isAuthenticated.set(isAuth);

		if (isAuth) {
			const userData = await client.getUser();
			user.set(userData ?? null);
		}
	} catch (error) {
		console.error('Auth0 initialization failed:', error);
		// Ensure loading state is turned off on error
		isLoading.set(false);
	} finally {
		isLoading.set(false);
	}
}

/**
 * Helper to trigger login
 */
export async function login() {
	if (!client) return;
	await client.loginWithRedirect();
}

/**
 * Helper to trigger logout
 */
export async function logout() {
	if (!client) return;
	await client.logout({
		logoutParams: {
			returnTo: window.location.origin
		}
	});
}

/**
 * Get the Access Token for API calls
 */
export async function getToken() {
	if (!client) return null;
	try {
		return await client.getTokenSilently();
	} catch (e) {
		console.error('Error getting token', e);
		return null;
	}
}
