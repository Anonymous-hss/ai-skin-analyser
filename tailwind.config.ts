import type { Config } from "tailwindcss"
const defaultTheme = require("tailwindcss/defaultTheme")

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#FDF8F3",
          100: "#F9EBD9",
          200: "#F2D7B3",
          300: "#EAC28D",
          400: "#E3AE67",
          500: "#D99A41", // Primary color
          600: "#C47F2A",
          700: "#A36522",
          800: "#824C1A",
          900: "#613312",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "#F5F7FA",
          100: "#E4E7EB",
          200: "#CBD2D9",
          300: "#9AA5B1",
          400: "#7B8794",
          500: "#616E7C", // Secondary color
          600: "#52606D",
          700: "#3E4C59",
          800: "#323F4B",
          900: "#1F2933",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          50: "#E3F8FF",
          100: "#B3ECFF",
          200: "#81DEFD",
          300: "#5ED0FA",
          400: "#40C3F7",
          500: "#2BB0ED", // Accent color
          600: "#1992D4",
          700: "#127FBF",
          800: "#0B69A3",
          900: "#035388",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Indian skin tone palette
        skintone: {
          lightest: "#F5DCBE", // Fair Indian skin tone
          light: "#E8C39E", // Light brown Indian skin tone
          medium: "#D2A679", // Medium brown Indian skin tone
          deep: "#B07D56", // Deep brown Indian skin tone
          darkest: "#8D5A3C", // Dark brown Indian skin tone
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        medium: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        serif: ["var(--font-merriweather)", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config

