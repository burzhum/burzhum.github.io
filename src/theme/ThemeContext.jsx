import { createContext, useContext, useEffect, useState } from 'react'

const ThemeCtx = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => (localStorage.getItem('shift') === 'day' ? 'day' : 'night'))

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('shift', theme)
  }, [theme])

  const toggle = () => setTheme(t => (t === 'night' ? 'day' : 'night'))
  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
