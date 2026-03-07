# ✨ L-SPA Web

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Bun](https://img.shields.io/badge/Bun-1.1-black?logo=bun&logoColor=white)](https://bun.sh/)

Plataforma integral para la gestión de servicios de Spa de lujo, diseñada para ofrecer una experiencia de usuario fluida desde el descubrimiento de servicios hasta la reserva y el pago.

---

## 🚀 Características Principales

- **🔐 Autenticación Robusta:** Sistema de registro e inicio de sesión seguro gestionado por **Auth0**.
- **📅 Gestión de Citas:** Motor de reservas interactivo con selección de horarios mediante `react-datepicker`.
- **🛒 Experiencia E-commerce:** Catálogo dinámico de servicios, carrito de compras persistente y flujo de checkout simulado.
- **🎨 UI Moderna:** Interfaz responsive y elegante construida con **Tailwind CSS 4** y componentes atómicos.
- **⚡ Rendimiento Optimizado:** Arquitectura basada en **Vite 6** para tiempos de carga ultrarrápidos y HMR.
- **🗄️ Persistencia de Datos:** Integración con **Neon (PostgreSQL)** vía **Drizzle ORM** para una gestión de datos escalable y moderna.

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** React 19 (TypeScript)
- **Bundler:** Vite 6
- **Package Manager:** Bun
- **Estilos:** Tailwind CSS 4, Lucide React (iconos)
- **Estado:** Context API (Cart)
- **Formularios:** React Hook Form + Zod (validación)

### Backend & Servicios
- **Auth:** Auth0
- **Base de Datos:** Neon Database (Serverless PostgreSQL)
- **ORM:** Drizzle ORM
- **Media:** Cloudinary (gestión de imágenes de servicios)

---

## 📂 Estructura del Proyecto

```bash
src/
├── api/          # Configuraciones de API externas
├── assets/       # Imágenes, iconos y recursos estáticos
├── components/   # Componentes UI (Atomic Design) y Layouts
├── context/      # Proveedores de estado global (CartContext)
├── controllers/  # Lógica de negocio y orquestación
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
