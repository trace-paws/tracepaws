import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // TracePaws brand colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0f766e",
          foreground: "#ffffff"
        },
        secondary: {
          DEFAULT: "#f1f5f9", 
          foreground: "#1e293b"
        },
        muted: {
          DEFAULT: "#f8fafc",
          foreground: "#64748b"
        },
        accent: {
          DEFAULT: "#0f766e",
          foreground: "#ffffff"
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff"
        },
        // TracePaws status colors
        "status": {
          received: "#3b82f6",
          progress: "#f59e0b", 
          ready: "#16a34a",
          completed: "#6b7280"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      },
      spacing: {
        'touch': '44px',
        'nav': '64px',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}

export default config