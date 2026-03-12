import { createAuthClient } from "better-auth/svelte";
import { PUBLIC_API_URL } from '$env/static/public';

export const authClient = createAuthClient({
    // El backend tiene basePath /api/v1 y el handler está en /auth/**
    baseURL: `${PUBLIC_API_URL}`
});
