import type { Config } from "tailwindcss";

// All colours, spacing, radii, fonts, and shadows are wired through
// CSS variables defined in app/tokens.css. Utility classes like
// `p-4`, `rounded-lg`, `text-acid`, `font-mono` therefore resolve
// against the same token layer that inline `style={{ … }}` uses —
// changing a token in one file updates every consumer.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        acid: "var(--acid)",
        "text-hi": "var(--text-hi)",
        "text-lo": "var(--text-lo)",
        hairline: "var(--hairline)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        acid: "0 0 32px var(--acid-glow)",
        specimen: "var(--specimen-shadow)",
      },
      // Spacing keys mirror the Tailwind numeric scale but resolve to
      // --space-* vars so the tokens.css file is the single source of
      // truth. The pixel values match Tailwind's defaults, so p-4,
      // gap-6, m-8 etc. render identically to before.
      spacing: {
        "0": "var(--space-0)",
        px: "var(--space-px)",
        "1": "var(--space-1)",
        "2": "var(--space-2)",
        "3": "var(--space-3)",
        "4": "var(--space-4)",
        "5": "var(--space-5)",
        "6": "var(--space-6)",
        "7": "var(--space-7)",
        "8": "var(--space-8)",
        "9": "var(--space-9)",
        "10": "var(--space-10)",
        "11": "var(--space-11)",
        "12": "var(--space-12)",
        "14": "var(--space-14)",
        "16": "var(--space-16)",
        "20": "var(--space-20)",
        "24": "var(--space-24)",
        "28": "var(--space-28)",
        "32": "var(--space-32)",
        "40": "var(--space-40)",
        "48": "var(--space-48)",
      },
      // Border-radius utility classes route through the --radius-*
      // scale. The scale has 7 steps after the consolidation pass
      // (dropped --radius-none, merged xl+2xl into a single 22 px xl,
      // renamed the phone-shell 40 px step from 3xl to 2xl). The
      // rounded-2xl utility maps to the phone-shell corner; the
      // former rounded-3xl class is gone (0 consumers).
      borderRadius: {
        none: "0",
        sm: "var(--radius-xs)",
        DEFAULT: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-pill)",
        pill: "var(--radius-pill)",
      },
    },
  },
  plugins: [],
};

export default config;
