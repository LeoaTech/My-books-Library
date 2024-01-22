
// const defaultTheme = import("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {

    extend: {
      fontSize: {
        "title-xxl": ["44px", "55px"],
        "title-xl": ["36px", "45px"],
        "title-xl2": ["33px", "45px"],
        "title-lg": ["28px", "35px"],
        "title-md": ["24px", "30px"],
        "title-md2": ["26px", "30px"],
        "title-sm": ["20px", "26px"],
        "title-xsm": ["18px", "24px"],
      },
     
    },
    colors: {
      current: "currentColor",
      transparent: "transparent",
      white: "#FFFFFF",
      black: "#1C2434",
      "black-2": "#010101",
      body: "#64748B",
      bodydark: "#AEB7C0",
      bodydark1: "#DEE4EE",
      bodydark2: "#8A99AF",
      primary: "#3C50E0",
      secondary: "#80CAEE",
      stroke: "#E2E8F0",
      gray: "#EFF4FB",
      blue: "#0284c7",
      lightblue: "#60a5fa",
      purple: "#581c87",
      graydark: "#333A48",
      "gray-2": "#F7F9FC",
      "gray-3": "#FAFAFA",
      whiten: "#F1F5F9",
      whiter: "#F5F7FD",
      boxdark: "#24303F",
      "boxdark-2": "#1A222C",
      strokedark: "#2E3A47",
      "form-strokedark": "#3d4d60",
      "form-input": "#1d2a39",
      "meta-1": "#DC3545",
      "meta-2": "#EFF2F7",
      "meta-3": "#10B981",
      "meta-4": "#313D4A",
      "meta-5": "#259AE6",
      "meta-6": "#FFBA00",
      "meta-7": "#FF6766",
      "meta-8": "#F0950C",
      "meta-9": "#E5E7EB",
      success: "#219653",
      danger: "#D34053",
      warning: "#FFA70B",

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
