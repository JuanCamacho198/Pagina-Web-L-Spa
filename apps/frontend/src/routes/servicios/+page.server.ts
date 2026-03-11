import { type Service } from '@l-spa/shared-types';
import { apiFetch } from '$lib/utils/api';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	try {
		const services: Service[] = await apiFetch('/services');
		return {
			services: services || []
		};
	} catch (error) {
		console.error('Error fetching services:', error);
		return {
			services: []
		};
	}
}
