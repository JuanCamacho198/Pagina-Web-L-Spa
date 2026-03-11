// @ts-nocheck
import type { PageServerLoad as PageServerLoader } from './$types';

export const load = async ({ fetch }: Parameters<PageServerLoader>[0]) => {
	const res = await fetch('http://localhost:3000/api/services');
	let services = [];
	if (res.ok) {
		services = await res.json();
	}

	return {
		services: services.slice(0, 3) // Only featured
	};
};
