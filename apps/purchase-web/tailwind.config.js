/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: '#00c2ff',
          cyanHover: '#00a3d9',
          emerald: '#10b981',
          emeraldHover: '#059669',
          darkBg: '#090d16',
          darkSurface: '#111726',
          darkCard: '#151d30',
          darkBorder: '#1e293b',
          lightBg: '#f0f3f8',
          lightCard: '#ffffff',
          lightBorder: '#e2e8f0',
          subBanner: '#005f38',
          alertRed: '#4a151b',
          alertRedLight: '#fee2e2'
        }
      }
    },
  },
  plugins: [],
}
