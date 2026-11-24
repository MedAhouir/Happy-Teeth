import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Brand palette
        porcelain: "#F5F9F7",
        enamel: { DEFAULT: "#E3F1EA", deep: "#CBE6DA" },
        spruce: { DEFAULT: "#0C2E2A", soft: "#1B4640", mute: "#5C7570" },
        brand: { DEFAULT: "#0E8F5C", dark: "#0A6F47", light: "#3DDC97" },
        coral: { DEFAULT: "#D6483D", soft: "#FCE9E6" },
        amber: { soft: "#FFF3D1", ink: "#8A5A00" },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        // Layered, low-opacity shadows read as depth without a hard border.
        soft: "0 0 0 1px rgba(12,46,42,.06), 0 1px 2px -1px rgba(12,46,42,.08), 0 2px 6px rgba(12,46,42,.05)",
        lift: "0 0 0 1px rgba(12,46,42,.08), 0 2px 4px -1px rgba(12,46,42,.08), 0 12px 24px -8px rgba(12,46,42,.12)",
        ring: "0 0 0 4px rgba(14,143,92,.18)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
