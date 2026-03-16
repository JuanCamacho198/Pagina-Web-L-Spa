import { createAuthClient } from "better-auth/svelte";
import { PUBLIC_API_URL } from '$env/static/public';
import { createApiClient } from '$lib/api';
import { createError } from '$lib/errors/factory';
import type { AppError } from '$lib/errors/types';

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000",
    basePath: "/api/v1/auth",
    fetchOptions: {
        credentials: 'include',
        onError(context) {
            console.error("Auth Client Error:", context.error);
        },
    }
});

export const apiClient = createApiClient({
    baseURL: PUBLIC_API_URL || 'http://localhost:3000/api/v1',
    defaultHeaders: {
        'Content-Type': 'application/json',
    },
});

export function convertAuthError(error: unknown): AppError {
    if (error instanceof Error) {
        const message = error.message.toLowerCase();
        
        if (message.includes('unauthorized') || message.includes('invalid') || message.includes('expired') || message.includes('session')) {
            return createError(
                'AUTH_ERROR',
                'Session expired or invalid',
                { originalMessage: error.message },
                error
            );
        }
        
        if (message.includes('network') || message.includes('fetch') || message.includes('failed to fetch')) {
            return createError(
                'NETWORK_ERROR',
                'Network error during authentication',
                { originalMessage: error.message },
                error
            );
        }
        
        return createError(
            'AUTH_ERROR',
            error.message || 'Authentication failed',
            { originalMessage: error.message },
            error
        );
    }
    
    return createError(
        'UNKNOWN_ERROR',
        'An unexpected error occurred during authentication',
        undefined,
        error
    );
}
