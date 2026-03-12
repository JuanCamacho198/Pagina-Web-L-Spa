import { apiFetch } from '$lib/utils/api';

export const ssr = false;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	console.log('--- Cargando servicios (solo cliente) ---');
	try {
        const services = await apiFetch('/services');
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
