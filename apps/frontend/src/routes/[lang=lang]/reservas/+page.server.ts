import { PUBLIC_API_URL } from '$env/static/public';

const API_URL = PUBLIC_API_URL || 'http://localhost:3000/api/v1';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
	try {
        // En una migración real, usaríamos Auth0 ID del contexto/cookie
        // Por ahora simulamos una carga de citas
		const response = await fetch(`${API_URL}/appointments?auth0Id=temp_user_id`);
        
		if (!response.ok) {
            return {
                appointments: [],
                error: 'No pudimos cargar tus reservas en este momento.'
            };
		}

		const appointments = await response.json();

		return {
			appointments: appointments || []
		};
	} catch (e) {
		return {
			appointments: [],
			error: 'Error de conexión con el servidor.'
		};
	}
}
