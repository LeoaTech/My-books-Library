// const defaultTheme = import("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        border: 'var(--color-border)',
        page:'var(--color-page)'
      },
    },
    keyframes: {
      infiniteSlider: {
        "0%": { transform: "translateX(0)" },
        "100%": { transform: "translateX(calc(-250px * 5))" },
      },
    },
    animation: {
      ["infinite-slider"]: "infiniteSlider 40s linear infinite",
    },
  },
  plugins: [],
};
