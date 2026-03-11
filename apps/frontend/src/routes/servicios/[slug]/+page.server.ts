import { error } from '@sveltejs/kit';
import { type Service } from '@l-spa/shared-types';
import { apiFetch } from '$lib/utils/api';

const slugify = (name: string) => 
    name.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-');

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const { slug } = params;

    try {
        const allServices: Service[] = await apiFetch('/services');
        const service = allServices.find(s => slugify(s.name) === slug);
        
        if (!service) {
            throw error(404, 'Servicio no encontrado');
        }

        return {
            service,
            recommendations: allServices
                .filter(s => s.id !== service.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
        };
    } catch (e) {
        console.error('Error loading service:', e);
        if (e.status === 404) throw e;
        throw error(500, 'Error interno al cargar el servicio');
    }
}
