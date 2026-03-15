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
        display: ['Playfair Display', 'serif'],
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif']
      },
      borderRadius: {
        '3xl': '2rem',
        '4xl': '3rem',
        '5xl': '4rem'
      },
      boxShadow: {
        'spa': '0 20px 50px -12px rgba(140, 27, 88, 0.12)',
        'spa-hover': '0 30px 60px -12px rgba(140, 27, 88, 0.18)'
      }
    }
  },
  // temporary, specific safelist for dynamic color utilities (prefer explicit entries)
  safelist: [
    'bg-primary',
    'bg-primary-light',
    'bg-primary-dark',
    'text-primary',
    'text-primary-dark',
    'bg-secondary',
    'text-secondary',
    'bg-accent',
    'text-accent'
  ],
  plugins: []
};
