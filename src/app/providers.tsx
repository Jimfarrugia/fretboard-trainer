"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { ScoresProvider } from "@/context/ScoresContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <ScoresProvider>{children}</ScoresProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
