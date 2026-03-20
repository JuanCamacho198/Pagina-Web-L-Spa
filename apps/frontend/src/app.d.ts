import type { SessionContext } from 'better-auth/types';

interface User {
	id: string;
	name: string;
	email: string;
	image?: string;
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			lang: 'es' | 'en';
			user?: User;
			session?: SessionContext;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
