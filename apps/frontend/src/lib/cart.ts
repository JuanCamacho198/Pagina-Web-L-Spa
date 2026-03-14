import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { authClient } from './auth-client';

export interface CartItem {
	id: string;
	serviceId: string;
	slug?: string;
	name: string;
	price: number;
	image?: string;
	quantity: number;
	description?: string;
	duration?: number;
}

// Constants
const API_URL = 'http://localhost:3000/api/v1';
const ANONYMOUS_ID_KEY = 'lspa_guest_id';

// Generate or get anonymous ID
function getAnonymousId(): string {
	if (!browser) return '';
	
	let anonymousId = localStorage.getItem(ANONYMOUS_ID_KEY);
	if (!anonymousId) {
		anonymousId = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
		localStorage.setItem(ANONYMOUS_ID_KEY, anonymousId);
	}
	return anonymousId;
}

// Store that syncs with API
export const cartStore = writable<CartItem[]>([]);

// Get session from auth client
async function getSession() {
	try {
		const session = await authClient.getSession();
		return session?.data;
	} catch {
		return null;
	}
}

// API functions
async function fetchCart() {
	if (!browser) return [];
	
	const session = await getSession();
	const anonymousId = getAnonymousId();
	const userId = session?.user?.id || null;
	
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};
	
	if (userId) {
		// User is logged in - send userId
		headers['X-User-ID'] = userId;
	} else {
		// Guest user - pass anonymous ID
		headers['X-Anonymous-ID'] = anonymousId;
	}
	
	try {
		const response = await fetch(`${API_URL}/cart`, {
			credentials: 'include',
			headers,
		});
		
		if (response.ok) {
			const data = await response.json();
			// Transform API response to CartItem format
			const items: CartItem[] = (data.items || []).map((item: any) => ({
				id: item.id,
				serviceId: item.serviceId,
				name: item.service?.name || '',
				price: parseFloat(item.service?.price || '0'),
				image: item.service?.imageUrl || '',
				quantity: item.quantity,
				description: item.service?.description,
				duration: item.service?.duration,
			}));
			return items;
		}
	} catch (e) {
		console.error('Error fetching cart from API:', e);
	}
	
	// Fallback to localStorage
	const saved = localStorage.getItem('lspa_cart');
	if (saved) {
		try {
			return JSON.parse(saved);
		} catch {
			return [];
		}
	}
	
	return [];
}

export const cart = {
	Subscribe: cartStore.subscribe,
	
	// Add standard subscribe for Svelte $ prefix compatibility
	subscribe: cartStore.subscribe,
	
	load: async () => {
		if (!browser) return;
		
		const items = await fetchCart();
		cartStore.set(items);
	},

	addItem: async (item: Omit<CartItem, 'id' | 'quantity'>) => {
		if (!browser) return;
		
		const anonymousId = getAnonymousId();
		const session = await getSession();
		const userId = session?.user?.id || null;
		
		try {
			const headers: Record<string, string> = {
				'Content-Type': 'application/json',
			};
			
			// Send userId if logged in, otherwise send anonymousId
			if (userId) {
				headers['X-User-ID'] = userId;
			} else {
				headers['X-Anonymous-ID'] = anonymousId;
			}
			
			const response = await fetch(`${API_URL}/cart/items`, {
				method: 'POST',
				headers,
				body: JSON.stringify({
					serviceId: item.serviceId,
					quantity: 1,
				}),
				credentials: 'include',
			});
			
			if (response.ok) {
				// Small delay to ensure DB write completes, then reload cart
				await new Promise(resolve => setTimeout(resolve, 100));
				
				// Fetch and update store directly to ensure reactivity
				const items = await fetchCart();
				cartStore.set(items);
				
				return;
			}
		} catch (e) {
			console.error('Error adding to cart via API:', e);
		}
		
		// Fallback to localStorage
		cartStore.update(items => {
			const existing = items.find(i => i.serviceId === item.serviceId);
			let newItems;
			if (existing) {
				newItems = items.map(i => i.serviceId === item.serviceId ? { ...i, quantity: i.quantity + 1 } : i);
			} else {
				newItems = [...items, { ...item, id: Math.random().toString(36).substring(2, 9), quantity: 1 }];
			}
			localStorage.setItem('lspa_cart', JSON.stringify(newItems));
			return newItems;
		});
	},

	clear: async () => {
		if (!browser) return;
		
		const anonymousId = getAnonymousId();
		
		try {
			await fetch(`${API_URL}/cart`, {
				method: 'DELETE',
				headers: {
					'X-Anonymous-ID': anonymousId,
				},
				credentials: 'include',
			});
		} catch (e) {
			console.error('Error clearing cart via API:', e);
		}
		
		cartStore.set([]);
		localStorage.removeItem('lspa_cart');
	},

	updateQuantity: async (itemId: string, quantity: number) => {
		if (!browser) return;
		
		const anonymousId = getAnonymousId();
		
		try {
			const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'X-Anonymous-ID': anonymousId,
				},
				body: JSON.stringify({ quantity }),
				credentials: 'include',
			});
			
			if (response.ok) {
				await cart.load();
				return;
			}
		} catch (e) {
			console.error('Error updating quantity via API:', e);
		}
		
		// Fallback to localStorage
		cartStore.update(items => {
			let newItems;
			if (quantity <= 0) {
				newItems = items.filter(i => i.id !== itemId);
			} else {
				newItems = items.map(i => i.id === itemId ? { ...i, quantity } : i);
			}
			localStorage.setItem('lspa_cart', JSON.stringify(newItems));
			return newItems;
		});
	},

	removeItem: async (itemId: string) => {
		if (!browser) return;
		
		const anonymousId = getAnonymousId();
		
		try {
			const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
				method: 'DELETE',
				headers: {
					'X-Anonymous-ID': anonymousId,
				},
				credentials: 'include',
			});
			
			if (response.ok) {
				await cart.load();
				return;
			}
		} catch (e) {
			console.error('Error removing item via API:', e);
		}
		
		// Fallback to localStorage
		cartStore.update(items => {
			const newItems = items.filter(i => i.id !== itemId);
			localStorage.setItem('lspa_cart', JSON.stringify(newItems));
			return newItems;
		});
	},
	
	// Migrate anonymous cart to user cart (call after login)
	migrateToUser: async () => {
		if (!browser) return;
		
		const anonymousId = getAnonymousId();
		
		try {
			await fetch(`${API_URL}/cart/migrate`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ anonymousId }),
				credentials: 'include',
			});
			
			// Reload cart after migration
			await cart.load();
		} catch (e) {
			console.error('Error migrating cart:', e);
		}
	}
};

export const cartCount = derived(cartStore, ($items) => {
	return $items.reduce((acc, item) => acc + item.quantity, 0);
});

export const cartSubtotal = derived(cartStore, ($items) => {
	return $items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
});
