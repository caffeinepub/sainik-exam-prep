import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        success: {
          DEFAULT: "oklch(var(--success))",
          foreground: "oklch(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "oklch(var(--warning))",
          foreground: "oklch(var(--warning-foreground))",
        },
        saffron: {
          50: "oklch(0.97 0.04 50)",
          100: "oklch(0.93 0.08 50)",
          200: "oklch(0.88 0.12 50)",
          300: "oklch(0.82 0.16 50)",
          400: "oklch(0.75 0.18 50)",
          500: "oklch(0.68 0.19 45)",
          600: "oklch(0.6 0.2 40)",
        },
        navy: {
          50: "oklch(0.94 0.02 255)",
          100: "oklch(0.88 0.04 255)",
          200: "oklch(0.78 0.06 255)",
          300: "oklch(0.6 0.08 255)",
          400: "oklch(0.45 0.09 255)",
          500: "oklch(0.35 0.1 255)",
          600: "oklch(0.28 0.09 255)",
          700: "oklch(0.22 0.08 255)",
          800: "oklch(0.18 0.07 255)",
          900: "oklch(0.13 0.05 255)",
        },
        india: {
          saffron: "oklch(0.75 0.18 50)",
          white: "oklch(0.98 0 0)",
          green: "oklch(0.55 0.18 145)",
          chakra: "oklch(0.35 0.1 255)",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0,0,0,0.05)",
        card: "0 4px 20px 0 oklch(0.25 0.08 255 / 0.08), 0 1px 3px 0 oklch(0.25 0.08 255 / 0.06)",
        "card-hover": "0 8px 32px 0 oklch(0.25 0.08 255 / 0.14), 0 2px 6px 0 oklch(0.25 0.08 255 / 0.08)",
        military: "0 8px 40px 0 oklch(0.18 0.07 255 / 0.35)",
        saffron: "0 4px 20px 0 oklch(0.75 0.18 50 / 0.3)",
      },
      backgroundImage: {
        "hero-pattern": "radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.35 0.1 255 / 0.4), transparent), linear-gradient(160deg, oklch(0.18 0.07 255) 0%, oklch(0.13 0.05 250) 100%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-up": {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-saffron": {
          "0%, 100%": { boxShadow: "0 0 0 0 oklch(0.75 0.18 50 / 0.4)" },
          "50%": { boxShadow: "0 0 0 8px oklch(0.75 0.18 50 / 0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-up": "slide-up 0.4s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "pulse-saffron": "pulse-saffron 2s ease-in-out infinite",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
