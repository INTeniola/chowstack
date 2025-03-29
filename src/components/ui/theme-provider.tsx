
"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type ThemeProviderProps } from "next-themes/dist/types"

// Define Theme type more explicitly
type Theme = "dark" | "light" | "system"

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
    () => {
      // Get the stored theme or use default
      const storedTheme = localStorage.getItem(storageKey)
      // Ensure we only return a valid Theme type
      return (storedTheme as Theme) || defaultTheme
    }
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
  
  // Create a strictly typed value object
  const value: ThemeContextType = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      <div className={theme} {...props}>{children}</div>
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
