import { type Service } from '@l-spa/shared-types';
import { apiFetch } from '$lib/utils/api';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	console.log('--- Cargando página de servicios ---');
	try {
		console.log('Llamando a apiFetch(/services)...');
		const services = await apiFetch('/services');
		console.log(`Servicios obtenidos: ${services?.length || 0}`);
		return {
			services: services || []
		};
	} catch (error) {
		console.error('!!! Error FATAL cargando servicios:', error);
		return {
			services: [],
			error: error instanceof Error ? error.message : 'Error desconocido'
		};
	}
}
