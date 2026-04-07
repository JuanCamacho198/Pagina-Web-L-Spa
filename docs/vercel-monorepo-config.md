# Configuracion Vercel Monorepo

## Estructura
- apps/frontend: aplicacion Svelte/SvelteKit
- apps/backend: API NestJS

## Fuente de verdad para deploy selectivo

- La logica canonica de deploy selectivo vive en GitHub Actions, no en Vercel Dashboard.
- Workflow canonico: `.github/workflows/cd.yml`.
- Script canonico de impacto: `scripts/ci/compute-impacts.mjs`.
- `scripts/vercel-ignore-build.sh` queda solo como compatibilidad temporal y esta deprecado.

## Matriz canonica de impacto (GitHub Actions)

| Path cambiado | Impacto | deploy_frontend | deploy_backend |
|---|---|---|---|
| `apps/frontend/**` | frontend | true | false |
| `apps/backend/**` | backend | false | true |
| `packages/shared-types/**` | shared | true | true |
| `packages/database/**` | backend | false | true |
| `package.json`, `bun.lock`, `bun.lockb`, `pnpm-lock.yaml`, `turbo.json`, `tsconfig*`, `.github/workflows/**` | shared | true | true |
| `docs/**`, `*.md`, `*.mdx` | none | false | false |
| Cualquier path no mapeado (fallback) | shared | true | true |

## Mapeo de rama a entorno

| Contexto | Modo de deploy |
|---|---|
| pull request | preview |
| push a `develop` | preview |
| push a `main` | production |

## Migracion y cierre operativo

### Checklist de migracion

- [ ] Confirmar que `cd.yml` incluye job `changes` y gating por `deploy_frontend`/`deploy_backend`.
- [ ] En Vercel Dashboard (frontend y backend), remover cualquier configuracion de `Ignored Build Step`.
- [ ] Verificar que no existan reglas de deploy selectivo fuera del repositorio.
- [ ] Ejecutar un PR de prueba con cambios solo en frontend y validar que backend no despliega.
- [ ] Ejecutar un PR de prueba con cambios en `packages/shared-types/**` y validar despliegue de ambos targets.
- [ ] Documentar URL del run de GitHub Actions que valida la migracion.

### Runbook de rollback

Usar este flujo si el deploy selectivo genera un incidente operativo.

1. Mitigacion inmediata:
   - Pausar merges a `main`/`develop` hasta estabilizar la canalizacion.
   - Si se requiere un redeploy urgente, disparar `workflow_dispatch` en `Release` desde el commit estable mas reciente.
2. Rollback de politica:
   - Revertir en git el commit que introdujo el comportamiento problematico en `.github/workflows/cd.yml` y/o `scripts/ci/compute-impacts.mjs`.
   - Abrir PR de rollback con etiqueta de incidente para auditoria.
3. Validacion post-rollback:
   - Confirmar en el run summary que los jobs esperados vuelven al comportamiento previo.
   - Registrar causa raiz preliminar y accion correctiva.

## Checklist de operacion y auditoria (on-call)

En cada incidente o validacion de rutina, revisar:

- [ ] `changes` job: `deploy_mode`, `impact_classes` y `impact_summary` en `GITHUB_STEP_SUMMARY`.
- [ ] Gating correcto: solo corre `deploy_frontend` cuando `deploy_frontend == true`.
- [ ] Gating correcto: solo corre `deploy_backend` cuando `deploy_backend == true`.
- [ ] No-cross-deploy: un cambio backend-only no dispara frontend, y viceversa.
- [ ] Entorno correcto: PR/develop en preview, `main` en production.
- [ ] Conservar evidencia (URL del run + extracto de summary JSON) en ticket/incidente.

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
