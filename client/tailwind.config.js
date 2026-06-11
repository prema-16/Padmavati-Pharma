/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#0057b8", dark: "#003d87", light: "#e8f0fb" },
        secondary: { DEFAULT: "#00a86b", light: "#e6f7f1" },
      },
      fontFamily: { sans: ["Poppins", "sans-serif"] },
    },
  },
  plugins: [],
};
