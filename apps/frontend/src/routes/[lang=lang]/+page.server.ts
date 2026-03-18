import type { PageServerLoad as PageServerLoader } from './$types';
import { apiClient } from '$lib/api';

export const load: PageServerLoader = async () => {
	let services = [];
	try {
		services = await apiClient.get('/services');
	} catch (e) {
		console.error('Error fetching featured services:', e);
	}

	return {
		services: (services || []).slice(0, 3) // Only featured
	};
};
