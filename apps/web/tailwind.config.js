/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          dark: '#0a192f',
          navy: '#0b2545',
          blue: '#134074',
          accent: '#005ea2',
          light: '#eef4f8',
          border: '#d2d8e0',
          saffron: '#FF671F',
          ashoka: '#000080',
          green: '#046A38',
        },
        status: {
          green: '#15803d',
          red: '#b91c1c',
          amber: '#b45309',
          blue: '#1d4ed8',
          grey: '#4b5563',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
