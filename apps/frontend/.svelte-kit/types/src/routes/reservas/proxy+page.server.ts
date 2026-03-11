// @ts-nocheck
/** @param {Parameters<import('./$types').PageServerLoad>[0]} event */
export async function load({ fetch }) {
	try {
        // En una migración real, usaríamos Auth0 ID del contexto/cookie
        // Por ahora simulamos una carga de citas
		const response = await fetch('http://localhost:3000/api/appointments?auth0Id=temp_user_id');
        
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
