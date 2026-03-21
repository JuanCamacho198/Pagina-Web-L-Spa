import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';

// Get API URL from window config (set in layout) or fallback - always call this function, don't cache it
function getApiUrl(): string {
	if (browser) {
		return (window as any).__PUBLIC_API_URL__ || 'http://localhost:3000/api/v1';
	}
	return 'http://localhost:3000/api/v1';
}

export interface FavoriteItem {
	id: string;
	serviceId: string;
	service?: {
		id: string;
		name: string;
		description: string;
		price: string;
		imageUrl: string;
		duration: number;
		category: string;
	};
	createdAt: Date;
}

// Generate or get anonymous ID
function getAnonymousId(): string {
	if (!browser) return '';
	
	const ANONYMOUS_ID_KEY = 'lspa_guest_id';
	let anonymousId = localStorage.getItem(ANONYMOUS_ID_KEY);
	if (!anonymousId) {
		anonymousId = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
		localStorage.setItem(ANONYMOUS_ID_KEY, anonymousId);
	}
	return anonymousId;
}

// Get session from auth client
async function getSession() {
	try {
		const { authClient } = await import('$lib/auth-client');
		const session = await authClient.getSession();
		return session?.data;
	} catch {
		return null;
	}
}

// Store that syncs with API
export const favoritesStore = writable<FavoriteItem[]>([]);

// Fetch favorites from API
export async function fetchFavorites() {
	if (!browser) return [];
	
	const session = await getSession();
	const anonymousId = getAnonymousId();
	const userId = session?.user?.id || null;
	
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};
	
	if (userId) {
		headers['X-User-ID'] = userId;
	} else {
		headers['X-Anonymous-ID'] = anonymousId;
	}
	
	try {
		const apiUrl = getApiUrl();
		const response = await fetch(`${apiUrl}/favorites`, {
			credentials: 'include',
			headers,
		});
		
		if (response.ok) {
			const data = await response.json();
			favoritesStore.set(data.items || []);
			return data.items || [];
		}
	} catch (e) {
		console.error('Error fetching favorites:', e);
	}
	
	return [];
}

// Add to favorites
export async function addToFavorites(serviceId: string) {
	if (!browser) return false;
	
	const session = await getSession();
	const anonymousId = getAnonymousId();
	const userId = session?.user?.id || null;
	
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};
	
	if (userId) {
		headers['X-User-ID'] = userId;
	} else {
		headers['X-Anonymous-ID'] = anonymousId;
	}
	
	try {
		const apiUrl = getApiUrl();
		const response = await fetch(`${apiUrl}/favorites`, {
			method: 'POST',
			headers,
			body: JSON.stringify({ serviceId }),
			credentials: 'include',
		});
		
		if (response.ok) {
			await fetchFavorites();
			return true;
		}
	} catch (e) {
		console.error('Error adding to favorites:', e);
	}
	
	return false;
}

// Remove from favorites
export async function removeFromFavorites(serviceId: string) {
	if (!browser) return false;
	
	const session = await getSession();
	const anonymousId = getAnonymousId();
	const userId = session?.user?.id || null;
	
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};
	
	if (userId) {
		headers['X-User-ID'] = userId;
	} else {
		headers['X-Anonymous-ID'] = anonymousId;
	}
	
	try {
		const apiUrl = getApiUrl();
		const response = await fetch(`${apiUrl}/favorites/${serviceId}`, {
			method: 'DELETE',
			headers,
			credentials: 'include',
		});
		
		if (response.ok) {
			await fetchFavorites();
			return true;
		}
	} catch (e) {
		console.error('Error removing from favorites:', e);
	}
	
	return false;
}

// Check if service is favorited
export async function checkIsFavorite(serviceId: string): Promise<boolean> {
	if (!browser) return false;
	
	const session = await getSession();
	const anonymousId = getAnonymousId();
	const userId = session?.user?.id || null;
	
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};
	
	if (userId) {
		headers['X-User-ID'] = userId;
	} else {
		headers['X-Anonymous-ID'] = anonymousId;
	}
	
	try {
		const apiUrl = getApiUrl();
		const response = await fetch(`${apiUrl}/favorites/check/${serviceId}`, {
			credentials: 'include',
			headers,
		});
		
		if (response.ok) {
			const data = await response.json();
			return data.isFavorite || false;
		}
	} catch (e) {
		console.error('Error checking favorite:', e);
	}
	
	return false;
}
