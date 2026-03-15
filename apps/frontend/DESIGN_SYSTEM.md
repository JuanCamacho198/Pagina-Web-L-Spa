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