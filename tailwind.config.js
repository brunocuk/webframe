/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4b2bff',
          dark: '#3a1fcc',
          light: '#b573ff',
        },
      },
      fontFamily: {
        sans: ['Nohemi', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(75, 43, 255, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(75, 43, 255, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
