/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#6B7753',
          dark: '#556143',
          light: '#556143',
        },
        olive: {
          DEFAULT: '#C8D0B5',
          dark: '#C8D0B5',
          light: '#C8D0B5',
        },
        cream: {
          DEFAULT: '#F8F5ED',
          dark: '#F8F5ED',
        },
        beige: {
          DEFAULT: '#E4DCCB',
          dark: '#E4DCCB',
        },
        gold: {
          DEFAULT: '#D4B06A',
          dark: '#D4B06A',
          light: '#D4B06A',
        },
        hennabrown: {
          DEFAULT: '#3B2D24',
        },
        charcoal: {
          DEFAULT: '#3B2D24',
        },
        successgreen: {
          DEFAULT: '#E7F2E9',
          text: '#2e7d32',
        },
        errorred: {
          DEFAULT: '#FBE8E6',
          text: '#c62828',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        sans: ['"Inter"', '"Manrope"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
