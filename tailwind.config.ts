import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,tsx,mdx}",
    "./components/**/*.{js,ts,tsx,mdx}",
    "./lib/**/*.{js,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        neon: "0 0 22px rgba(0, 245, 255, 0.22), 0 0 50px rgba(236, 72, 153, 0.12)",
        glow: "0 0 40px rgba(124, 58, 237, 0.25)",
      },
      colors: {
        bg: {
          deep: "var(--color-bg-deep)",
          mid: "var(--color-bg-mid)",
          soft: "var(--color-bg-soft)",
        },
        accent: {
          cyan: "#00F5FF",
          purple: "#7C3AED",
          pink: "#EC4899",
          blue: "#3B82F6",
        },
      },
      backgroundImage: {
        "mesh-gradient":
          "radial-gradient(circle at 20% 20%, rgba(0,245,255,0.12), transparent 40%), radial-gradient(circle at 80% 0%, rgba(124,58,237,0.18), transparent 35%), radial-gradient(circle at 50% 100%, rgba(236,72,153,0.1), transparent 40%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
