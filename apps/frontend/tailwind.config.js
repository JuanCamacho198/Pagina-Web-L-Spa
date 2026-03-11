/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
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
  plugins: []
};
