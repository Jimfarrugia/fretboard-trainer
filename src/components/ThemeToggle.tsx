"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return <p>Loading theme toggle...</p>;

  if (resolvedTheme === "light") {
    return <button onClick={() => setTheme("dark")}>Dark Theme</button>;
  }

  if (resolvedTheme === "dark") {
    return <button onClick={() => setTheme("light")}>Light Theme</button>;
  }
}
