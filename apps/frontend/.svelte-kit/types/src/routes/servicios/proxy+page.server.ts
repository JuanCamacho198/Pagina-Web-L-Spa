// @ts-nocheck
import { type Service } from '@l-spa/shared-types/services';

/** @param {Parameters<import('./$types').PageServerLoad>[0]} event */
export async function load({ fetch }) {
	const response = await fetch('http://localhost:3000/api/services');
	const services: Service[] = await response.json();

	return {
		services
	};
}
