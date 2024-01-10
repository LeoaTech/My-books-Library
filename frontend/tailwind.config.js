export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  // darkMode:"class",
  theme: {
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
