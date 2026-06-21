import type { Config } from "tailwindcss";

// AskBobAI brand tokens (Brand Guide, Edition 01, 2026).
// - Brand blue (#1281DE) carries the mood.  -> `brand-*`
// - AskBob Green (#19D467) marks CALLS TO ACTION and nothing else. -> `action-*`
// - Ink (#0A0A0A) carries the message. Soft greens are for positive accents.
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // AskBob Blue scale (anchor 500 = #1281DE).
        brand: {
          50: "#edf7ff",
          100: "#d6ecff",
          200: "#afd8fb",
          300: "#7fbef6",
          400: "#429eec",
          500: "#1281de",
          600: "#0e6ac0",
          700: "#0c5a9e",
          800: "#08406f",
          900: "#052a49",
        },
        // AskBob Green scale (anchor 500 = #19D467). CTAs only.
        action: {
          50: "#f2faf5",
          100: "#d9f7e5",
          200: "#b8e6c9",
          300: "#99f0bd",
          400: "#3fe08a",
          500: "#19d467",
          600: "#14b257",
          700: "#0e9447",
        },
        // Named brand colors used directly.
        bob: {
          bluedeep: "#003cab", // overlay / depth
          cyan: "#0ac6ff", // highlight
          greenSoft: "#99f0bd", // editorial accent
          ink: "#0a0a0a", // body / dark text
          surface: "#151922", // dark surfaces
          card: "#edf7ff", // card background
          panel: "#fafbfc", // soft panels
          muted: "#6a6a6a", // secondary text
          line: "#b5b8bf", // muted UI lines
        },
      },
      fontFamily: {
        sans: ["Figtree", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', "ui-serif", "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        eyebrow: "0.18em",
      },
    },
  },
  plugins: [],
};

export default config;
