import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          body: "#2D2474",
          heading: "#2F3793",
          link: "#3A61C7",
          hover: "#2D2474",
          bg: "#FFFFFF",
          darkerBg: "#C8CEDE",
          highlight: "#F1CD88",
        },
        dark: {
          body: "#D1D0C5",
          heading: "#646669",
          link: "#D1D0C5",
          hover: "#E1B62F",
          bg: "#323437",
          darkerBg: "#2C2E31",
          highlight: "#E1B62F",
        },
      },
    },
    colors: {
      gold: "#E0B53E",
      silver: "#C8CEDE",
      bronze: "#C59162",
    },
  },
  plugins: [],
  darkMode: "class",
};
export default config;
