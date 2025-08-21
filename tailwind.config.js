/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        appetit: {
          red: '#E85A5A',
          orange: '#FF6B35',
        }
      },
      fontFamily: {
        sans: ['system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
