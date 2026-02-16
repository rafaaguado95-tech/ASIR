/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nextia-darker': '#050812',
        'nextia-dark': '#0A0F1E',
        'nextia-cyan': '#00D9FF',
        'nextia-purple': '#9D4EDD',
        'nextia-green': '#06FFA5'
      }
    },
  },
  plugins: [],
}
