import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import {
  applyTheme,
  getStoredTheme,
  getSystemTheme,
  subscribeToSystemTheme,
  THEME_STORAGE_KEY,
  ThemeContext,
  type Theme,
} from '@/lib/theme'

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme)
  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemTheme,
  )

  const resolvedTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, next)
    setThemeState(next)
  }, [])

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}
