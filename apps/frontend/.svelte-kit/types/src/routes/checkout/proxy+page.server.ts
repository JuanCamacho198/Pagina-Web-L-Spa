// @ts-nocheck
import type { PageServerLoad as PageServerLoader } from './$types';

export const load = async ({ fetch, url }: Parameters<PageServerLoader>[0]) => {
	const serviceId = url.searchParams.get('serviceId');
	const auth0Id = 'temp_user_id'; // Simulation

	let itemsToCheckout = [];

	if (serviceId) {
		const res = await fetch(`http://localhost:3000/api/services/${serviceId}`);
		if (res.ok) {
			const service = await res.json();
			itemsToCheckout = [service];
		}
	} else {
		const res = await fetch(`http://localhost:3000/api/users/cart?auth0Id=${auth0Id}`);
		if (res.ok) {
			itemsToCheckout = await res.json();
		}
	}

	return {
		itemsToCheckout,
		serviceIdFromUrl: serviceId
	};
};
