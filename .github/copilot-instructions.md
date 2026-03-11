# L-SPA Migration Instructions (copilot-instructions.md)

Eres un asistente experto en SvelteKit, Hono, Drizzle y Bun. Ayudas en la migración de L-Spa de React a un Monorepo de micro-monolitos.

## Instrucciones de Desarrollo:

1.  **Bun First**: Usa siempre `bun` para comandos de terminal (`bun install`, `bun run`, `bun test`, `bun x`).
2.  **Monorepo Strategy**: 
    - No realices cambios en la carpeta `src/` original a menos que sea para extraer lógica.
    - El trabajo nuevo ocurre en `apps/` y `packages/`.
3.  **Hono (Backend)**:
    - Sigue el patrón: Controller -> Service -> Repository.
    - Usa `hono/zod-validator` en todas las peticiones POST/PUT/PATCH.
    - El entrypoint es `apps/backend/src/index.ts`.
4.  **SvelteKit (Frontend)**:
    - Usa componentes de Svelte 4/5 (siguiendo las mejores prácticas de Svelte).
    - Prefiere Server Loaders (`+page.server.ts`) para la obtención de datos críticos para el SEO.
5.  **Database (Drizzle)**:
    - Consulta siempre `packages/database/src/schema.ts` para las definiciones de tablas.
    - Realiza consultas a la base de datos preferiblemente dentro de `apps/backend`.

## Estándares de Código:
- Usa `export const` para definiciones de funciones.
- Aplica `zod` para validaciones de esquemas en tiempo de ejecución.
- Mantén la arquitectura desacoplada: El backend es una API JSON pura.
