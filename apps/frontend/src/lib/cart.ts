import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { authClient } from './auth-client';

export interface CartItem {
	id: string;
	serviceId: string;
	slug: string;
	name: string;
	price: number;
	image: string;
	quantity: number;
}

// Store básico que es 100% seguro en SSR
const cartStore = writable<CartItem[]>([]);

const API_URL = 'http://localhost:3000/api/v1';

async function checkAuth(): Promise<boolean> {
	if (!browser) return false;
	try {
		const session = await authClient.getSession();
		return !!session?.data;
	} catch {
		return false;
	}
}

export const cart = {
	subscribe: cartStore.subscribe,
	
	load: async () => {
		if (!browser) return;
		const isAuth = await checkAuth();
		if (isAuth) {
			try {
				const response = await fetch(`${API_URL}/cart`, { credentials: 'include' });
				if (response.ok) {
					const data = await response.json();
					cartStore.set(data.items || []);
					return;
				}
			} catch (e) {
				console.error(e);
			}
		}
		const saved = localStorage.getItem('lspa_cart');
		if (saved) {
			try { cartStore.set(JSON.parse(saved)); } catch { cartStore.set([]); }
		}
	},

	addItem: async (item: Omit<CartItem, 'id' | 'quantity'>) => {
		if (!browser) return;
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
		// Sync logic here if needed...
	},

	clear: () => {
		cartStore.set([]);
		if (browser) localStorage.removeItem('lspa_cart');
	}
};

export const cartCount = derived(cartStore, ($items) => {
	return $items.reduce((acc, item) => acc + item.quantity, 0);
});

export const cartSubtotal = derived(cartStore, ($items) => {
	return $items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
});
