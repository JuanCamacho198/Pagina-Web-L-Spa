/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    // include other apps and packages in the monorepo
    '../../apps/**/src/**/*.{html,js,svelte,ts}',
    '../../packages/**/src/**/*.{html,js,svelte,ts}',
    // include shared files at repo root (if any)
    '../../**/*.{html,js,svelte,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#BF3F7F',
          DEFAULT: '#8C1B58',
          dark: '#590E35'
        },
        secondary: {
          DEFAULT: '#F2D7D9'
        },
        accent: {
          DEFAULT: '#D99B9B'
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  // keep a small safelist for dynamically generated classes used across the app
  safelist: [
    { pattern: /^bg-(primary|secondary|accent)(?:-.+)?$/ },
    { pattern: /^text-(primary|secondary|accent)(?:-.+)?$/ }
  ],
  plugins: []
};
