/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#111',
        danger: '#b00020',
      },
    },
  },
  plugins: [],
}