import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        sand: "#f5f1eb",
        clay: "#d6c5b0",
        gold: "#b5894d",
        mist: "#dce5ef",
        pine: "#16423c"
      },
      boxShadow: {
        panel: "0 20px 60px rgba(15, 23, 42, 0.12)"
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.08) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};

export default config;
