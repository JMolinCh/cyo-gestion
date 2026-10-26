/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        muni: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#38a8f7',
          500: '#0e8ceb',
          600: '#026ec9',
          700: '#0358a3',
          800: '#074b86',
          900: '#0b3f6f',
          950: '#07284a',
        },
        maca: {
          50: '#fbf9f1',
          100: '#f6f1de',
          200: '#ede1bd',
          300: '#e1cb93',
          400: '#d4b167',
          500: '#c59a46',
          600: '#ab7f37',
          700: '#89602e',
          800: '#714e2b',
          900: '#5e4127',
        }
      },
    },
  },
  plugins: [],
}
