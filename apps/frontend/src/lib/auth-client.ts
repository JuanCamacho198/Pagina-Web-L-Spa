import { createAuthClient } from "better-auth/svelte";
import { PUBLIC_API_URL } from '$env/static/public';

/**
 * Better Auth client configuration.
 * Note: Removed dash() plugin to avoid Buffer-related SSR issues 
 * as the dashboard is typically handled in the backend or a dedicated admin app.
 */
export const authClient = createAuthClient({
    // The backend has basePath /api/v1 and the handler is in /auth/**
    baseURL: `${PUBLIC_API_URL}`,
    plugins: [
        // Add browser-safe plugins here if needed
    ]
});
