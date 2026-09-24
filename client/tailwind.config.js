/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0A0F1D',
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
        },
        brand: {
          blue: '#2563EB',
          'blue-hover': '#1D4ED8',
          cyan: '#06B6D4',
          teal: '#0D9488',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
