/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)', ink: 'var(--ink)', muted: 'var(--muted)',
        accent: 'var(--accent)', accent2: 'var(--accent2)',
        card: 'var(--card)', line: 'var(--line)',
      },
      fontFamily: {
        display: ['Archivo', 'ui-sans-serif', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
