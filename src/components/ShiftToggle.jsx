import { useTheme } from '../theme/ThemeContext'

export default function ShiftToggle() {
  const { theme, toggle } = useTheme()
  const next = theme === 'night' ? 'day_shift' : 'night_shift'
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${next}`}
      className="font-mono text-xs tracking-widest border border-line px-3 py-1.5 hover:text-accent hover:border-accent transition-colors"
    >
      {theme === 'night' ? '☾ night_shift' : '☀ day_shift'}
    </button>
  )
}
