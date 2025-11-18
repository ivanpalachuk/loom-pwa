/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ['Loos', 'system-ui', '-apple-system', 'sans-serif'],
      'loos': ['Loos', 'system-ui', '-apple-system', 'sans-serif'],
    },
    extend: {
      colors: {
        'loom': {
          DEFAULT: '#004EA8',  // PANTONE 2145 C - 100%
          100: '#004EA8',      // PANTONE 2145 C - 100%
          70: '#4D7FBD',       // PANTONE 2145 C - 70%
          50: '#8099D3',       // PANTONE 2145 C - 50%
          20: '#CCDBF0',       // PANTONE 2145 C - 20%
          10: '#E5EDF7',       // PANTONE 2145 C - 10%
        },
      },
    },
  },
  plugins: [],
}

