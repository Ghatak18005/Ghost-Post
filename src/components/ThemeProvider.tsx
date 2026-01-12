"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }: any) {
  return (
    <NextThemesProvider 
      attribute="class"  // 👈 THIS LINE IS MANDATORY FOR TAILWIND
      defaultTheme="dark" 
      enableSystem={false} 
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}