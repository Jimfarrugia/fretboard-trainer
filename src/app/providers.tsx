"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { ScoresProvider } from "@/context/ScoresContext";
import { SettingsProvider } from "@/context/SettingsContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <ScoresProvider>
          <SettingsProvider>{children}</SettingsProvider>
        </ScoresProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
