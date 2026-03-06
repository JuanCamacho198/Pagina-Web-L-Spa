export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#BF3F7F', // Ajustar colores de acuerdo a la paleta oficial
          DEFAULT: '#8C1B58',
          dark: '#590E35',
        },
        secondary: '#F2D7D9',
        accent: '#D99B9B',
      },
    },
  },
  plugins: [],
}
