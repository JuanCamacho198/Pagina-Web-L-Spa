import { createAuthClient } from "better-auth/svelte";
import { PUBLIC_API_URL } from '$env/static/public';

/**
 * Better Auth client configuration.
 * Note: Removed dash() plugin to avoid Buffer-related SSR issues 
 * as the dashboard is typically handled in the backend or a dedicated admin app.
 */
export const authClient = createAuthClient({
    // baseURL must be the backend server URL
    baseURL: "http://localhost:3000",
    // When using custom prefix in backend, we should set it here
    // Better Auth will append /sign-up/email to this
    basePath: "/api/v1/auth",
    // Ensure cookies are sent (especially important if frontend and backend have different origins)
    fetchOptions: {
        credentials: 'include',
        onError(context) {
            console.error("Auth Client Error:", context.error);
        },
    }
});
