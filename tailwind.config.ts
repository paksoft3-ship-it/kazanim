import type { Config } from "tailwindcss";

/**
 * Kazanım Gayrimenkul design tokens.
 *
 * Approved palette: deep emerald + dark navy as the dominant brand colors,
 * champagne gold used with restraint for accents, warm ivory for breathing
 * room. See CLAUDE.md §4 for the full design direction.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core brand palette
        "deep-emerald": "#063E36",
        "forest-emerald": "#0B5145",
        "dark-navy": "#071D2B",
        "midnight-navy": "#061824",
        "champagne-gold": "#C7A45B",
        "soft-gold": "#E3D0A4",
        "warm-ivory": "#F7F2E8",
        "soft-cream": "#FBF8F1",
        "soft-white": "#FFFFFF",
        charcoal: "#1E262B",
        slate: "#6A7479",
        "warm-border": "#DDD4C4",
        "admin-bg": "#F4F6F7",
        "success-green": "#28765C",
        "warning-orange": "#B97A2F",
        "error-red": "#B44B4B",

        // Semantic aliases used throughout shared markup
        primary: "#063E36",
        secondary: "#C7A45B",
        background: "#F7F2E8",
        surface: "#FBF8F1",
        "surface-bright": "#FBF8F1",
        "surface-dim": "#DEDAD0",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F8F3E9",
        "surface-container": "#F2EDE3",
        "surface-container-high": "#ECE8DE",
        "surface-container-highest": "#E7E2D8",
        "surface-variant": "#E7E2D8",
        "on-primary": "#FFFFFF",
        "on-secondary": "#061824",
        "on-background": "#1E262B",
        "on-surface": "#1E262B",
        "on-surface-variant": "#44474D",
        "primary-container": "#071D2B",
        "on-primary-container": "#8FA6A0",
        "inverse-surface": "#32302A",
        "inverse-on-surface": "#F5F0E6",
        "inverse-primary": "#A8C3BC",
        outline: "#75777E",
        "outline-variant": "#C5C6CE",
        error: "#B44B4B",
        "on-error": "#FFFFFF",
        "error-container": "#FFDAD6",
        "on-error-container": "#93000A",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        sm: "0.125rem",
        md: "0.25rem",
        lg: "0.25rem",
        xl: "0.5rem",
      },
      spacing: {
        "max-width": "1360px",
        gutter: "24px",
        "margin-mobile": "16px",
        "stack-sm": "8px",
        "stack-md": "16px",
        "stack-lg": "32px",
        "section-gap-desktop": "100px",
        "section-gap-mobile": "56px",
      },
      maxWidth: {
        "max-width": "1360px",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "serif"],
        sans: ["var(--font-manrope)", "Manrope", "system-ui", "sans-serif"],
        "hero-heading": ["var(--font-playfair)", "Playfair Display", "serif"],
        "hero-heading-mobile": ["var(--font-playfair)", "Playfair Display", "serif"],
        "section-heading": ["var(--font-playfair)", "Playfair Display", "serif"],
        "section-heading-mobile": ["var(--font-playfair)", "Playfair Display", "serif"],
        "body-lg": ["var(--font-manrope)", "Manrope", "sans-serif"],
        "body-md": ["var(--font-manrope)", "Manrope", "sans-serif"],
        "body-sm": ["var(--font-manrope)", "Manrope", "sans-serif"],
        "button-text": ["var(--font-manrope)", "Manrope", "sans-serif"],
        "label-caps": ["var(--font-manrope)", "Manrope", "sans-serif"],
      },
      fontSize: {
        "hero-heading": ["72px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "hero-heading-mobile": ["36px", { lineHeight: "1.2", fontWeight: "700" }],
        "section-heading": ["48px", { lineHeight: "1.2", fontWeight: "600" }],
        "section-heading-mobile": ["32px", { lineHeight: "1.2", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "button-text": ["14px", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "600" }],
        "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "700" }],
      },
      keyframes: {
        "zoom-slow": {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.1)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "zoom-slow": "zoom-slow 20s infinite alternate",
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
