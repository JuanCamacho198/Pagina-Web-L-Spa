// @ts-nocheck
import { error } from '@sveltejs/kit';
import type { Service } from '@l-spa/shared-types/services';

/** @param {Parameters<import('./$types').PageServerLoad>[0]} event */
export async function load({ params, fetch }) {
	const { slug } = params;

	// Intentar obtener el servicio por el slug (nombre normalizado en el backend)
	// En el backend original se filtraba por name. En Hono necesitamos asegurarnos que maneje esto.
	const response = await fetch(`http://localhost:3000/api/services?name=${slug}`);
	
	if (!response.ok) {
		throw error(404, 'Servicio no encontrado');
	}

	const service: Service = await response.json();

    // Si el backend devuelve un array (como antes), tomamos el primero
    // o si el backend devuelve un 404 si no existe.
    if (!service) {
        throw error(404, 'Servicio no encontrado');
    }

    // Obtener recomendaciones
    const recommendationsRes = await fetch('http://localhost:3000/api/services');
    let allServices: Service[] = [];
    if (recommendationsRes.ok) {
        allServices = await recommendationsRes.json();
    }

	return {
		service,
        recommendations: allServices
            .filter(s => s.id !== service.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
	};
}
