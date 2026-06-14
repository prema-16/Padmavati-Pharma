/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        primary: { DEFAULT: "#0057b8", dark: "#003d87", light: "#e8f0fb" },
        secondary: { DEFAULT: "#00a86b", light: "#e6f7f1" },
      },
      fontFamily: { sans: ["Poppins", "sans-serif"] },
      spacing: {
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
    },
  },
  plugins: [],
};
