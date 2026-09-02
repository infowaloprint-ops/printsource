import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#241209",
          900: "#3A2318",
          700: "#5C3A28",
          500: "#8A6A54",
        },
        clay: {
          600: "#D85A30",
          500: "#E37450",
          100: "#FAE3D8",
        },
        paper: "#FBF8F4",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
