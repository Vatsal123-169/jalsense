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
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          900: '#134e4a',
        },
        flood: {
          danger: '#ff3b5c',
          warning: '#ffb703',
          surge: '#00f2fe',
          safe: '#10b981',
          dark: '#0b0f19',
          panel: '#131b2e',
          card: '#1a243b'
        }
      },
    },
  },
  plugins: [],
}
