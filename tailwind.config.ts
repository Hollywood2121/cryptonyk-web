import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#00d09c",
        },
        bg: {
          DEFAULT: "#0d1117",
          card: "rgba(255,255,255,.05)",
          border: "#30363d"
        }
      }
    }
  },
  plugins: []
} satisfies Config;
