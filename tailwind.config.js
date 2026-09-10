/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#080B10',
          900: '#0B0F17',
          800: '#121826',
          700: '#1B2333',
          600: '#2A3347',
        },
        teal: { 400: '#2DD4BF', 300: '#5EEAD4' },
        coral: { 400: '#FB7185' },
        mist: { 400: '#8B96A8', 200: '#C7CFDB' },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(45, 212, 191, 0.25)',
        coralGlow: '0 0 18px rgba(251, 113, 133, 0.35)',
        panel: '0 8px 40px rgba(0, 0, 0, 0.45)',
      },
    },
  },
  plugins: [],
}
