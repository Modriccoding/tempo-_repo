/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "spotify-green": "#1DB954",
        "spotify-dark": "#282828",
        "spotify-darker": "#181818",
        "spotify-darkest": "#121212",
        "spotify-light": "#3E3E3E",
      },
    },
  },
  plugins: [],
};
