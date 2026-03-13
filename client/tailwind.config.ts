import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          primary: "#E40E7C",
          strong: "#B80B63",
          soft: "#FCEBF4",
          50: "#FCEBF4",
          100: "#F9D5E8",
          150: "#F5BFD8",
          200: "#F2A8C8",
        },
        ink: "#080808",
        muted: "#5F6360",
        line: "rgba(228, 14, 124, 0.1)",
        surface: "rgba(255, 255, 255, 0.92)",
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      backdropBlur: {
        xl: "18px",
      },
      boxShadow: {
        "surface-sm": "0 10px 30px rgba(228, 14, 124, 0.08)",
        surface: "var(--surface-shadow)",
        "rose-lg": "0 18px 40px rgba(228, 14, 124, 0.24)",
        "rose-md": "0 16px 32px rgba(228, 14, 124, 0.2)",
      },
      backgroundImage: {
        "rose-gradient": "linear-gradient(135deg, #E40E7C, #B80B63)",
      },
      borderRadius: {
        full: "999px",
      },
    },
  },
  plugins: [],
} satisfies Config;
