import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "var(--accent)",
          light: "var(--accent-light)",
          dark: "var(--accent-dark)",
        },
        surface: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          card: "var(--bg-card)",
        },
      },
      fontFamily: {
        heading: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-onest)", "sans-serif"],
        sans: ["var(--font-onest)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
