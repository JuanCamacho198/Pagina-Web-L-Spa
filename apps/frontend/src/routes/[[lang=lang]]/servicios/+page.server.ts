import { apiClient } from '$lib/api';
import type { Service } from '@l-spa/shared-types';

export const ssr = false;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	console.log('--- Cargando servicios (solo cliente) ---');
	try {
        const services = await apiClient.get<Service[]>('/services');
        console.log(`Servicios obtenidos: ${services.length}`);
		return {
			services
		};
	} catch (error) {
		console.error('Error loading services:', error);
		return {
			services: [],
			error: 'No se pudieron cargar los servicios'
		};
	}
}
