export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-surface": "var(--on-surface)",
        "primary": "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "surface": "var(--surface)",
        "background": "var(--background)",
        "surface-container": "var(--surface-container)",
        "surface-container-low": "var(--surface-container-low)",
        "surface-container-lowest": "var(--surface-container-lowest)",
        "surface-variant": "var(--surface-variant)",
        "on-surface-variant": "var(--on-surface-variant)",
        "outline": "var(--outline)",
        "outline-variant": "var(--outline-variant)",
        "secondary": "var(--secondary)",
        "tertiary": "var(--tertiary)",
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
      spacing: {
        "container-max": "1400px",
        "sm": "8px",
        "xl": "48px",
        "unit": "4px",
        "gutter": "24px",
        "lg": "24px",
        "xxl": "80px",
        "md": "16px",
        "xs": "4px"
      },
      fontSize: {
        "display": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "headline-lg": ["3rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "headline-md": ["1.5rem", { lineHeight: "1.3" }],
        "body-lg": ["1.125rem", { lineHeight: "1.75" }],
        "body-md": ["1rem", { lineHeight: "1.6" }],
        "label-md": ["0.875rem", { lineHeight: "1.5", letterSpacing: "0.05em" }],
      },
      fontFamily: {
        "display": ["Montserrat", "sans-serif"],
        "headline-md": ["Montserrat", "sans-serif"],
        "headline-lg": ["Montserrat", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Montserrat", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"]
      },
    },
  },
  plugins: [],
}
