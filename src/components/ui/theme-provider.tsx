
"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type ThemeProviderProps } from "next-themes/dist/types"

// Define Theme type more explicitly
type Theme = "dark" | "light" | "system" | string

// Update ThemeContextType to ensure it exactly matches what we provide
type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeContextType = {
  theme: "system",
  setTheme: () => null,
}

export const ThemeProviderContext = createContext<ThemeContextType>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement
    
    root.classList.remove("light", "dark")
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
        
      root.classList.add(systemTheme)
      return
    }
    
    root.classList.add(theme)
  }, [theme])
  
  // Create the value object with explicit typing
  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
  } as ThemeContextType

  return (
    <ThemeProviderContext.Provider value={value}>
      <div {...props}>{children}</div>
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  
  return context
}
