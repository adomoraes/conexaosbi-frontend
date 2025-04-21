const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-satoshi)', ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        18: '4.5rem',
        112: '28rem',
        120: '30rem',
      },
      // colors: {
      //   slate: {
      //     50: '#ffe5e5',
      //     100: '#fbbaba',
      //     200: '#f28f8f',
      //     300: '#e96464',
      //     400: '#e03939',
      //     500: '#c72020', // Cor principal
      //     600: '#9b1919',
      //     700: '#701212',
      //     800: '#460b0b',
      //     900: '#1f0404',
      //   },
      // },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
