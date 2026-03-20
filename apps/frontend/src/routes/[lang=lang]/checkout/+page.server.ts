import type { PageServerLoad as PageServerLoader } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';

const API_URL = PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const load: PageServerLoader = async ({ fetch, url }) => {
	const serviceId = url.searchParams.get('serviceId');
	const auth0Id = 'temp_user_id'; // Simulation

	let itemsToCheckout = [];

	if (serviceId) {
		const res = await fetch(`${API_URL}/services/${serviceId}`);
		if (res.ok) {
			const service = await res.json();
			itemsToCheckout = [service];
		}
	} else {
		const res = await fetch(`${API_URL}/users/cart?auth0Id=${auth0Id}`);
		if (res.ok) {
			itemsToCheckout = await res.json();
		}
	}

	return {
		itemsToCheckout,
		serviceIdFromUrl: serviceId
	};
};
