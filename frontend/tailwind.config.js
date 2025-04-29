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
        'furia-red': '#FF0000',
        'furia-dark': '#121218',
        'furia-darker': '#0A0A0F',
        'furia-gray': '#2D2D2D',
        'furia-purple': '#7A33FF',
        'furia-purple-light': '#9E6CFF',
        'furia-purple-dark': '#5A1FCC',
        'furia-black': '#080810',
        'furia-light': '#F2F2F2',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'scale': 'scale 0.3s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'neon': '0 0 5px rgba(122, 51, 255, 0.2), 0 0 20px rgba(122, 51, 255, 0.1)',
        'neon-lg': '0 0 10px rgba(122, 51, 255, 0.3), 0 0 30px rgba(122, 51, 255, 0.2)',
        'inner-neon': 'inset 0 0 5px rgba(122, 51, 255, 0.2)',
      }
    },
  },
  plugins: [],
} 