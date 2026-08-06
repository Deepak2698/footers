/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#cccccc',
          400: '#999999',
          500: '#666666',
          600: '#404040',
          700: '#1a1a1a',
          800: '#0d0d0d',
          900: '#000000',
        },
        gold: {
          50: '#fffdf0',
          100: '#fefce8',
          200: '#fef3c7',
          300: '#fde68a',
          400: '#fcd34d',
          500: '#fbbf24',
          600: '#f59e0b',
          700: '#d97706',
          800: '#b45309',
          900: '#92400e',
        },
        white: {
          50: '#ffffff',
          100: '#f8fafc',
          200: '#f1f5f9',
          300: '#e2e8f0',
          400: '#cbd5e1',
          500: '#94a3b8',
          600: '#64748b',
          700: '#475569',
          800: '#334155',
          900: '#1e293b',
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
        'black-gradient': 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #404040 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #fbbf24 0%, #fcd34d 25%, #fbbf24 50%, #fcd34d 75%, #fbbf24 100%)',
        'hero-gradient': 'linear-gradient(135deg, #000000 0%, #1a1a1a 40%, #d97706 100%)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-gold': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      fontFamily: {
        'luxury': ['Playfair Display', 'serif'],
        'modern': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold': '0 4px 20px rgba(251, 191, 36, 0.3)',
        'gold-lg': '0 10px 40px rgba(251, 191, 36, 0.4)',
        'black': '0 4px 20px rgba(0, 0, 0, 0.5)',
        'black-lg': '0 10px 40px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [],
}
