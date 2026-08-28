"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// For next-themes v0.3.x or v0.4.x, we can usually just omit the explicit type 
// if it causes issues, or import from next-themes directly if exported.
export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
