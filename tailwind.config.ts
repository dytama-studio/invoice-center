import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/modules/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "#f7f7f5",
        ink: "#141414",
        muted: "#6b6b6b",
        accent: "#0f3d2e",
        line: "#d9d9d9",
        sheet: "#ffffff"
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.06)"
      }
    }
  },
  plugins: []
};

export default config;
