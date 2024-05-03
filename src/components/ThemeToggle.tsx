"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const handleClick = () =>
    setTheme(resolvedTheme === "light" ? "dark" : "light");

  if (!mounted)
    return (
      <span className="loading loading-spinner loading-md text-light-darkerBg dark:text-dark-heading"></span>
    );

  return (
    <button
      aria-label={`${resolvedTheme === "light" ? "dark" : "light"} mode`}
      className="rounded-full text-xl text-light-link transition-colors hover:text-light-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-light-link dark:text-dark-link dark:hover:text-dark-hover focus-visible:dark:outline-dark-highlight"
      onClick={handleClick}
    >
      {resolvedTheme === "light" ? (
        <FiMoon aria-label="dark mode" />
      ) : (
        <FiSun aria-label="light mode" />
      )}
    </button>
  );
}
