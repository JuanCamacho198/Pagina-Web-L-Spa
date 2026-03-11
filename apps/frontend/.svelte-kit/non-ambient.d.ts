
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/carrito" | "/checkout" | "/contacto" | "/informacion-importante" | "/payment-confirmation" | "/perfil" | "/politicas" | "/politicas/cancelacion" | "/politicas/cookies" | "/politicas/privacidad" | "/preguntas-frecuentes" | "/reservas" | "/servicios" | "/servicios/[slug]" | "/sobre-nosotros";
		RouteParams(): {
			"/servicios/[slug]": { slug: string }
		};
		LayoutParams(): {
			"/": { slug?: string };
			"/carrito": Record<string, never>;
			"/checkout": Record<string, never>;
			"/contacto": Record<string, never>;
			"/informacion-importante": Record<string, never>;
			"/payment-confirmation": Record<string, never>;
			"/perfil": Record<string, never>;
			"/politicas": Record<string, never>;
			"/politicas/cancelacion": Record<string, never>;
			"/politicas/cookies": Record<string, never>;
			"/politicas/privacidad": Record<string, never>;
			"/preguntas-frecuentes": Record<string, never>;
			"/reservas": Record<string, never>;
			"/servicios": { slug?: string };
			"/servicios/[slug]": { slug: string };
			"/sobre-nosotros": Record<string, never>
		};
		Pathname(): "/" | "/carrito" | "/checkout" | "/contacto" | "/informacion-importante" | "/payment-confirmation" | "/perfil" | "/politicas/cancelacion" | "/politicas/cookies" | "/politicas/privacidad" | "/preguntas-frecuentes" | "/reservas" | "/servicios" | `/servicios/${string}` & {} | "/sobre-nosotros";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}