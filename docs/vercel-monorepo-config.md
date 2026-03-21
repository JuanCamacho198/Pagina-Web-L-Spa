# Configuración Vercel Monorepo

## Estructura
- apps/frontend: Aplicación Svelte/SvelteKit
- apps/backend: API Hono (Serverless)

## Deploy Selectivo

### Paso 1: Subir script a Vercel
El script scripts/vercel-ignore-build.sh debe estar en git.

### Paso 2: Configurar "Ignored Build Step" en Dashboard

Para cada proyecto en Vercel Dashboard:

1. Ir a Settings → General
2. En "Build Command", hacer click en "Override"
3. En "Ignored Build Step", agregar:

**Para Frontend:**
```
./scripts/vercel-ignore-build.sh frontend
```

**Para Backend:**
```
./scripts/vercel-ignore-build.sh backend
```

## Comportamiento

| Archivos cambiados | Frontend deploys | Backend deploys |
|-------------------|------------------|-----------------|
| apps/frontend/*   | ✅               | ❌              |
| apps/backend/*    | ❌               | ✅              |
| packages/*        | ❌               | ✅              |
| README.md (root)  | ❌               | ❌              |
