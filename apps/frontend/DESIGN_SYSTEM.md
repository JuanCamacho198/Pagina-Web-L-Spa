# L-SPA Design System

## 1. Typography

The design system relies on a combination of classical elegance and modern readability.

*   **Headings (Serif):** `Playfair Display`. Used for primary titles, section headers, and elements that need an elegant, luxurious touch.
*   **Body (Sans-Serif):** `Inter`. Used for paragraphs, UI elements (buttons, navigation), and general readability.

**Scale:**
*   Display: `text-6xl` to `text-9xl` (for Hero sections)
*   H1: `text-4xl` to `text-5xl`
*   H2: `text-3xl`
*   H3: `text-2xl`
*   Body Large: `text-lg`
*   Body Base: `text-base`
*   Body Small/Caption: `text-sm` or `text-xs` (often with uppercase and tracking for technical/meta text)

## 2. Color Palette

The color palette reflects relaxation, premium quality, and a spa environment.

### Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-primary: #8C1B58;
  --color-primary-light: #BF3F7F;
  --color-primary-dark: #590E35;
  --color-secondary: #F2D7D9;
  --color-accent: #D99B9B;
  
  /* Radii */
  --radius-sm: 0.5rem;
  --radius-md: 1rem;
  --radius-lg: 2rem;
  --radius-xl: 3rem;
  --radius-pill: 9999px;

  /* Shadows */
  --shadow-spa: 0 20px 50px -12px rgba(140, 27, 88, 0.12);
  --shadow-spa-hover: 0 30px 60px -12px rgba(140, 27, 88, 0.18);
}
```

### Primary (The Brand Core)
*   **Primary Default:** `#8C1B58` (Deep Magenta/Plum, used for primary buttons, prominent text).
*   **Primary Light:** `#BF3F7F` (Used for highlights, hover states, gradients).
*   **Primary Dark:** `#590E35` (Used for deep contrasts, footer backgrounds).

### Secondary & Accent (Softness & Warmth)
*   **Secondary:** `#F2D7D9` (Soft pink, used for subtle backgrounds, card highlights).
*   **Accent:** `#D99B9B` (Muted rose, used for secondary elements, icons).

### Neutrals (Structure & Balance)
*   **Background (Light):** Use white (`bg-white`) and soft grays (`bg-gray-50`).
*   **Background (Dark Mode):** Use deep gray/black (`bg-gray-900`, `bg-gray-800`).
*   **Text (Light):** `text-gray-900` for headings, `text-gray-600` for body.
*   **Text (Dark):** `text-gray-100` for headings, `text-gray-400` para body.

## 3. Spacing & Layout

*   **Grid System:** Standard 12-column grid. 
*   **Containers:** Max-width of `max-w-7xl` (1280px) for most sections to maintain readability.
*   **Padding/Margins:** Use generous spacing (`py-20`, `py-32`, `gap-8`, `gap-12`) to allow the UI to "breathe", which is crucial for a premium spa feel.

## 4. UI Components & Elements

### Componentes Base (Diseño & Lógica)

Cada componente debe seguir estos estados: `Default`, `Hover`, `Focus`, `Active`, `Disabled`.

#### 1. Button (Pill Styled)
```svelte
<button class="bg-primary text-white font-bold uppercase tracking-widest py-4 px-10 rounded-full shadow-lg transition-all duration-300 hover:bg-primary-light hover:shadow-xl hover:-translate-y-1 active:scale-95 focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:pointer-events-none">
  RESERVAR AHORA
</button>
```

#### 2. Card (Spa Minimalist)
```svelte
<div class="bg-white rounded-[3rem] p-10 shadow-2xl shadow-primary/5 border border-secondary/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-primary/10">
  <!-- ICON -->
  <div class="w-16 h-16 bg-secondary/30 rounded-2xl flex items-center justify-center text-primary mb-6">
    <Icon size={32} />
  </div>
  <h3 class="font-display text-2xl text-gray-900 mb-4">Título del Servicio</h3>
  <p class="text-gray-600 leading-relaxed">Descripción detallada del tratamiento...</p>
</div>
```

#### 3. Input (Elegante)
```svelte
<input type="text" placeholder="Tu Nombre" 
  class="w-full bg-gray-50 border-0 border-b-2 border-secondary p-4 focus:border-primary focus:ring-0 transition-all placeholder:text-gray-400 outline-none" />
```

### Buttons
*   **Primary Button:** Rounded full pill (`rounded-full`), uppercase, bold tracking. Solid primary background, white text. Added shadow for depth (`shadow-lg`).
*   **Secondary/Ghost Button:** Transparent background, primary text, subtle hover effects.

### Cards
*   **Style:** Clean white (or dark gray in dark mode) backgrounds, soft generous border radii (`rounded-3xl` or `rounded-[3rem]`), and large, diffuse shadows (`shadow-2xl shadow-primary/5`) for elevation.
*   **Interactions:** Subtle vertical translation (`hover:-translate-y-2`) on hover to indicate interactability without feeling jumpy.

### Imagery
*   Images should use `object-cover` and have subtle overlays (linear gradients) when text is placed on top of them to guarantee contrast. 
*   Corners can be heavily rounded (`rounded-[3rem]`) to match the soft, welcoming feel of the spa.

## 5. Animation & Transitions
*   Use long, smooth transitions (e.g., `duration-500` or `duration-700`) to evoke a calm, unhurried atmosphere.
*   Elements entering the viewport can use slow fade-ins and subtle upward translations.

### 6. Tailwind Config Guide

Para implementar este sistema, actualiza `tailwind.config.js`:

```js
theme: {
  extend: {
    fontFamily: {
      display: ['Playfair Display', 'serif'],
      sans: ['Inter', 'sans-serif']
    },
    colors: {
      primary: {
        DEFAULT: '#8C1B58',
        light: '#BF3F7F',
        dark: '#590E35'
      },
      secondary: '#F2D7D9',
      accent: '#D99B9B'
    },
    borderRadius: {
      'spa-sm': '0.5rem',
      'spa-md': '1rem',
      'spa-lg': '2rem',
      'spa-xl': '3rem',
      'spa-xxl': '4rem'
    },
    boxShadow: {
      '2xl': '0 25px 50px -12px rgba(140, 27, 88, 0.15)'
    }
  }
}
```

### 7. Accessibility Rules

1.  **Contrast:** Garantizar un ratio de 4.5:1 para cuerpo de texto y 3:1 para títulos grandes (WCAG AA).
2.  **Focus States:** Siempre usar `:focus-visible` con un anillo de contraste (`ring-primary/40`).
3.  **Reduced Motion:** Respetar la configuración del sistema para usuarios sensibles.

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```