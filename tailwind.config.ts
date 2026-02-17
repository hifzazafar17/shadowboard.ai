import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        red: {
          DEFAULT: '#FF2D20',
          dark: '#CC2419',
        },
        black: {
          DEFAULT: '#0A0A0A',
          mid: '#1A1A1A',
          light: '#2A2A2A',
        },
        cream: '#F5F0E8',
        gray: {
          mid: '#2A2A2A',
          light: '#888888',
        }
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      letterSpacing: {
        widest: '0.3em',
      },
    },
  },
  plugins: [],
};

export default config;