'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'
import { Switch } from './ui/switch'

export function ThemeSwitcher() {
  const { setTheme, theme, systemTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Monta il componente solo lato client
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Non renderizzare nulla durante il server-side rendering
  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark')

  return (
    <Switch 
      checked={isDark}
      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      aria-label="Toggle dark mode"
    />
  )
}