# Configuración Vercel Monorepo

## Estructura
- apps/frontend: Aplicación Svelte/SvelteKit
- apps/backend: NestJS API

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

## Variables de entorno por proyecto

Usar proyectos separados en Vercel para evitar mezclar variables.

### Frontend (Vercel project: `apps/frontend`)

Publicas (se exponen al cliente):
- `PUBLIC_API_URL=https://l-spa-backend.vercel.app/api/v1`
- `PUBLIC_SITE_URL=https://l-spa.vercel.app`
- `PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name`
- `VITE_SENTRY_DSN=...` (opcional)

Solo servidor (SSR / server runtime):
- `SENTRY_DSN=...` (opcional)
- `LOG_LEVEL=info`

Referencia: `apps/frontend/.env.example`

### Backend (Vercel project: `apps/backend`)

Solo servidor (nunca publicar en cliente):
- `NODE_ENV=production`
- `PORT=3000`
- `DATABASE_URL=...`
- `BETTER_AUTH_SECRET=...`
- `BETTER_AUTH_API_KEY=...`
- `BETTER_AUTH_URL=https://l-spa-backend.vercel.app/api/v1/auth`
- `BETTER_AUTH_TRUSTED_ORIGINS=https://l-spa.vercel.app,https://l-spa-frontend.vercel.app,https://l-spa-git-*.vercel.app`
- `SENTRY_DSN=...` (opcional)

Referencia: `apps/backend/.env.example`

## Nota importante sobre origins

- No usar trailing slash en URLs de origen (por ejemplo `https://l-spa.vercel.app`, no `https://l-spa.vercel.app/`).
- El backend normaliza el origin entrante y los valores configurados para evitar bugs por slash final en CORS.
