import { type Service } from '@l-spa/shared-types/services';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
	const response = await fetch('http://localhost:3000/api/services');
	const services: Service[] = await response.json();

	return {
		services
	};
}
