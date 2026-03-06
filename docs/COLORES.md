# Identidad Visual: L-SPA (Rebranding)

Este documento detalla la paleta de colores oficial tras el rebranding de **Luxury Spa** a **L-SPA**. Estos colores están implementados en el núcleo de Tailwind CSS v4 del proyecto.

## 🎨 Paleta de Colores

| Color | Hexadecimal | Nombre Tailwind | Uso sugerido |
| :--- | :--- | :--- | :--- |
| ![#8C1B58](https://via.placeholder.com/15/8C1B58?text=+) **Borgoña L-SPA** | `#8C1B58` | `primary` | Color principal, botones, encabezados. |
| ![#BF3F7F](https://via.placeholder.com/15/BF3F7F?text=+) **Rosa Vibrante** | `#BF3F7F` | `primary-light` | Hover de botones, detalles secundarios. |
| ![#590E35](https://via.placeholder.com/15/590E35?text=+) **Ciruela Profundo** | `#590E35` | `primary-dark` | Texto acentuado, fondos oscuros. |
| ![#F2D7D9](https://via.placeholder.com/15/F2D7D9?text=+) **Crema Rosado** | `#F2D7D9` | `secondary` | Fondos de secciones, tarjetas suaves. |
| ![#D99B9B](https://via.placeholder.com/15/D99B9B?text=+) **Salmón Suave** | `#D99B9B` | `accent` | Detalles decorativos, divisores. |

## 🛠️ Implementación Técnica (Tailwind CSS v4)

Los colores están definidos en `src/index.css` bajo el bloque `@theme`:

```css
@theme {
  --color-primary-light: #BF3F7F;
  --color-primary: #8C1B58;
  --color-primary-dark: #590E35;
  --color-secondary: #F2D7D9;
  --color-accent: #D99B9B;
}
```

## 📝 Notas del Rebranding
- El nombre oficial pasa de **Luxury Spa** a **L-SPA**.
- Se mantiene la elegancia del borgoña pero con un enfoque más minimalista y moderno.
