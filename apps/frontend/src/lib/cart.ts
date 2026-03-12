import { writable, derived, get } from 'svelte/store';
import { authClient } from './auth-client';
import { PUBLIC_API_URL } from '$env/static/public';

/**
 * Interface for a cart item
 */
export interface CartItem {
	id: string;
	serviceId: string;
	slug: string;
	name: string;
	price: number;
	image: string;
	quantity: number;
}

/**
 * Helper to check if user is authenticated via Better Auth
 */
async function checkAuth(): Promise<boolean> {
	try {
		const session = await authClient.getSession();
		return !!session?.data;
	} catch {
		return false;
	}
}

/**
 * Cart Store State
 */
const createCartStore = () => {
	const { subscribe, set, update } = writable<CartItem[]>([]);

	return {
		subscribe,
		set,
		update,
		/**
		 * Load cart from API if authenticated, else from localStorage
		 */
		load: async () => {
			// Skip SSR
			if (typeof window === 'undefined') return;

			const isAuth = await checkAuth();
			if (isAuth) {
				try {
					const response = await fetch(`${PUBLIC_API_URL}/cart`, {
						credentials: 'include',
						headers: {}
					});
					if (response.ok) {
						const data = await response.json();
						set(data.items || []);
						return;
					}
				} catch (error) {
					console.error('Failed to load cart from API:', error);
				}
			}

			// Fallback to localStorage
			const savedCart = localStorage.getItem('lspa_cart');
			if (savedCart) {
				try {
					set(JSON.parse(savedCart));
				} catch (e) {
					set([]);
				}
			}
		},

		/**
		 * Add item to cart and sync
		 */
		addItem: async (item: Omit<CartItem, 'id' | 'quantity'>) => {
			let currentItems: CartItem[] = [];
			update((items) => {
				const existing = items.find((i) => i.serviceId === item.serviceId);
				let newItems;
				if (existing) {
					newItems = items.map((i) =>
						i.serviceId === item.serviceId ? { ...i, quantity: i.quantity + 1 } : i
					);
				} else {
					newItems = [...items, { ...item, id: crypto.randomUUID(), quantity: 1 }];
				}
				
				currentItems = newItems;
				// Sync to local storage immediately
				localStorage.setItem('lspa_cart', JSON.stringify(newItems));
				return newItems;
			});

			// Sync to API if authenticated (Better Auth uses cookies)
			const isAuth = await checkAuth();
			if (isAuth) {
				try {
					await fetch(`${PUBLIC_API_URL}/cart`, {
						method: 'POST',
						credentials: 'include',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ items: currentItems })
					});
				} catch (e) {
					console.error('Failed to sync cart to API', e);
				}
			}
		},

		updateQuantity: async (serviceId: string, quantity: number) => {
			let currentItems: CartItem[] = [];
			update((items) => {
				const newItems = items.map((i) =>
					i.serviceId === serviceId ? { ...i, quantity: Math.max(1, quantity) } : i
				);
				currentItems = newItems;
				localStorage.setItem('lspa_cart', JSON.stringify(newItems));
				return newItems;
			});

			// Sync to API if authenticated
			const isAuth = await checkAuth();
			if (isAuth) {
				try {
					await fetch(`${PUBLIC_API_URL}/cart`, {
						method: 'POST',
						credentials: 'include',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ items: currentItems })
					});
				} catch (e) {
					console.error('Failed to sync cart quantity to API', e);
				}
			}
		},

		/**
		 * Remove item from cart
		 */
		removeItem: async (serviceId: string) => {
			let currentItems: CartItem[] = [];
			update((items) => {
				const newItems = items.filter((i) => i.serviceId !== serviceId);
				currentItems = newItems;
				localStorage.setItem('lspa_cart', JSON.stringify(newItems));
				return newItems;
			});

			// Sync to API if authenticated
			const isAuth = await checkAuth();
			if (isAuth) {
				try {
					await fetch(`${PUBLIC_API_URL}/cart`, {
						method: 'POST',
						credentials: 'include',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ items: currentItems })
					});
				} catch (e) {
					console.error('Failed to sync cart removal to API', e);
				}
			}
		},

		/**
		 * Clear cart
		 */
		clear: () => {
			set([]);
			localStorage.removeItem('lspa_cart');
		}
	};
};

export const cart = createCartStore();

/**
 * Derived store for subtotal
 */
export const cartSubtotal = derived(cart, ($cart) => {
	return $cart.reduce((Acc, item) => Acc + item.price * item.quantity, 0);
});

/**
 * Derived store for item count
 */
export const cartCount = derived(cart, ($cart) => {
	return $cart.reduce((Acc, item) => Acc + item.quantity, 0);
});
