"use client";

import { ThemeProvider } from "next-themes";
import { ScoresProvider } from "@/context/ScoresContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ScoresProvider>{children}</ScoresProvider>
    </ThemeProvider>
  );
}
