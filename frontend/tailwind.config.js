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
        terracotta: {
          50: '#FDF7F4',
          100: '#F8EBE4',
          200: '#F0D4C5',
          300: '#E5B59C',
          400: '#DA8F6E',
          500: '#D96B43', // Primary brand color
          600: '#C85A32',
          700: '#A34321',
          800: '#7E341A',
          900: '#5A2613',
          950: '#38160B',
        },
        surface: {
          light: '#FFFFFF',
          'light-muted': '#F8FAFC',
          dark: '#141C2E',
          'dark-muted': '#0B0F19',
          border: '#E2E8F0',
          'border-dark': '#2A364F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow': '0 0 20px -3px rgba(217, 107, 67, 0.4)',
        'glow-lg': '0 0 35px -5px rgba(217, 107, 67, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
