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
        bg: {
          color: 'var(--bg-color)',
        },
        surface: {
          color: 'var(--surface-color)',
        },
        text: {
          color: 'var(--text-color)',
          muted: 'var(--text-muted)',
        },
        primary: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        }
      }
    },
  },
  plugins: [],
}
