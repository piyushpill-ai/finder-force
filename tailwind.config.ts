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
        finder: {
          50: "#fef7ee",
          100: "#fcecd8",
          200: "#f8d5b0",
          300: "#f3b77d",
          400: "#ed9048",
          500: "#e87425",
          600: "#d9591b",
          700: "#b44318",
          800: "#90361b",
          900: "#742f19",
          950: "#3e150b",
        },
        midnight: {
          50: "#f4f6fb",
          100: "#e8ecf6",
          200: "#ccd7eb",
          300: "#9fb5da",
          400: "#6b8dc4",
          500: "#486fae",
          600: "#375792",
          700: "#2e4677",
          800: "#293d63",
          900: "#1a2744",
          950: "#0f172a",
        },
      },
      fontFamily: {
        display: ["var(--font-cabinet)", "system-ui", "sans-serif"],
        body: ["var(--font-satoshi)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

