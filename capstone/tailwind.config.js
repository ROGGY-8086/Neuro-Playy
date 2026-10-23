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
        parchment: {
          50: '#FAF9F5',
          100: '#F4F3EE',
          200: '#EAE8DF',
          300: '#DDD9CD',
          400: '#C7C2B2',
          900: '#181714',
        },
        ink: {
          950: '#0E0F12',
          900: '#15161A',
          800: '#22232A',
          700: '#343640',
          500: '#646675',
          400: '#9092A0',
          200: '#D5D7DF',
        },
        labYellow: {
          DEFAULT: '#F5B800',
          hover: '#E0A800',
          light: '#FFF5D6',
          glow: '#FFE066',
        },
        labMint: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
        },
        labRed: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Syne', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '3px 3px 0px #0E0F12',
        'brutal-lg': '5px 5px 0px #0E0F12',
        'brutal-yellow': '3px 3px 0px #F5B800',
      },
    },
  },
  plugins: [],
}
