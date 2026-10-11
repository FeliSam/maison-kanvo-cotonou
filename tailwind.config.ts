import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          bg: "var(--luxury-bg)",
          card: "var(--luxury-card)",
          surface: "var(--luxury-surface)",
          text: "var(--luxury-text)",
          muted: "var(--luxury-muted)",
          border: "var(--luxury-border)",
          gold: "var(--luxury-gold)",
          goldHover: "var(--luxury-gold-hover)",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "Times", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
