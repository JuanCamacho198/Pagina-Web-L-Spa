# ✨ L-SPA Web (Monorepo)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte&logoColor=white)](https://svelte.dev/)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2-FF3E00?logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![Hono](https://img.shields.io/badge/Hono-4-E36002?logo=hono&logoColor=white)](https://hono.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Bun](https://img.shields.io/badge/Bun-1.1-black?logo=bun&logoColor=white)](https://bun.sh/)

Plataforma integral para la gestión de servicios de Spa de lujo, migrada a una arquitectura de **Monorepo** moderna usando **SvelteKit** y **Hono**.

---

## 🚀 Características Principales

- **🔐 Autenticación Robusta:** Sistema gestionado por **Better Auth** con integración de Dashboard (Infra).
- **📅 Gestión de Citas:** Motor de reservas interactivo con Svelte 5 Runes.
- **🛒 Experiencia E-commerce:** Catálogo dinámico de servicios, carrito de compras persistente y flujo de checkout.
- **🎨 UI Moderna:** Interfaz de alto nivel con **Tailwind CSS 4** y **Svelte 5**.
- **⚡ Arquitectura Decoupled:** Frontend en SvelteKit y Backend API pura en Hono.
- **🗄️ Persistencia de Datos:** Integración con **PostgreSQL** vía **Drizzle ORM**.

---

## 🛠️ Stack Tecnológico

### Monorepo (Bun Workspaces)
- **Runtime:** Bun
- **Frontend:** SvelteKit 2 + Svelte 5 (Runes)
- **Backend:** Hono API
- **Auth:** Better Auth
- **Database:** Drizzle ORM + PostgreSQL
- **Estilos:** Tailwind CSS 4

---

## 📂 Estructura del Monorepo

```bash
apps/
├── frontend/     # SvelteKit 5 App (SSR & Client)
├── backend/      # Hono API Server
packages/
├── database/     # Esquemas de Drizzle y cliente DB común
├── shared-types/ # Tipos TyperScript compartidos entre apps
```

---

## 🛠️ Instalación y Desarrollo

Este proyecto utiliza **Bun Workspaces**.

```bash
# Instalar dependencias
bun install

# Levantar todo el monorepo en desarrollo
bun run dev

# Levantar aplicaciones específicas
bun run dev --filter frontend
bun run dev --filter backend
```

---

## 📝 Notas de Migración

Este proyecto se encuentra en una fase de migración de una base de código React monolitica a este monorepo basado en micro-monolitos. La lógica original se encuentra en el directorio raíz (temporalmente) mientras se extrae a los nuevos servicios en `apps/`.

├── db/           # Configuración de Drizzle y Schemas SQL
├── features/     # Módulos por dominio (auth, booking, catalog, admin)
├── lib/          # Utilidades y librerías (Cloudinary, etc.)
├── models/       # Interacción directa con servicios/BBDD
└── types/        # Definiciones de tipos TypeScript globales
```

---

## ⚙️ Configuración del Entorno

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/L-SPA.git
   cd L-SPA
   ```

2. **Instalar dependencias:**
   ```bash
   bun install
   ```

3. **Variables de Entorno:**
   Crea un archivo `.env` basado en `.env.example`:
   ```env
   VITE_DATABASE_URL=...
   VITE_CLOUDINARY_CLOUD_NAME=...
   VITE_CLOUDINARY_API_KEY=...
   VITE_CLOUDINARY_API_SECRET=...
   VITE_AUTH0_DOMAIN=...
   VITE_AUTH0_CLIENT_ID=...
   ```

---

## 🛠️ Scripts Disponibles

| Comando | Descripción |
| :--- | :--- |
| `bun dev` | Inicia el servidor de desarrollo |
| `bun run build` | Compila la aplicación para producción |
| `bun run preview` | Previsualiza la compilación localmente |
| `bun run lint` | Ejecuta ESLint para verificar calidad de código |

---

## 👤 Autor

- **Juan Camacho**

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

---
<p align="center">Desarrollado con ❤️ usando Bun y React 19.</p>
