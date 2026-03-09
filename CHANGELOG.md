# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
- Implementación de endpoints de API para el carrito de compras y refactorización de `CartContext`.
- Mejora en el manejo de errores en el endpoint de reseñas (`GET /api/reviews`).
- Soporte para búsqueda de servicios por nombre con normalización y manejo de errores.
- Optimización dinámica de imágenes en la función `getOptimizedUrl` de Cloudinary.
- Refactorización de `ServicesView` y `ReviewList` para utilizar `SWR` en la obtención de datos.
- Adición de esquema de tabla de reseñas y manejador de API para CRUD de reseñas.
- Implementación de `ServiceDetailView` con soporte para SEO mediante `JSON-LD`.
- Añadido componente `CloudinaryImage` para manejo optimizado de imágenes.
- Mejora integral del soporte para modo oscuro en `NavBar`, `ServicesView`, `ContactView` y estilos globales.
- Optimización de SEO con `react-helmet-async`, `robots.txt`, `sitemap.xml` y datos estructurados `LocalBusiness`.
- Adición de `ErrorBoundary` para rutas de administración.
- Migración de README a formato profesional y adición de guías de contribución y licencia.
- Creación de `CONTRIBUTING.md` y `CODE_OF_CONDUCT.md`.

## [0.1.0] - 2026-03-09
- Lanzamiento inicial con funcionalidades base de catálogo, servicios, reseñas y optimización SEO.
