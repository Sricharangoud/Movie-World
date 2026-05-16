/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a', // deep slate dark
        surface: '#1e293b',
        primary: '#3b82f6', // blue-500
        secondary: '#10b981', // emerald-500
        accent: '#f59e0b', // amber-500
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
