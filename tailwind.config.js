/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)', ink: 'var(--ink)', muted: 'var(--muted)',
        accent: 'var(--accent)', accent2: 'var(--accent2)',
        card: 'var(--card)', panel: 'var(--panel)', line: 'var(--line)',
      },
      fontFamily: {
        display: ['"Clash Display"', 'Archivo', '"Arial Black"', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
