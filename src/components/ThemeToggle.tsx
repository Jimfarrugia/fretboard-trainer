"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const handleClick = () =>
    setTheme(resolvedTheme === "light" ? "dark" : "light");

  if (!mounted)
    return (
      <div className="text-xl text-light-link dark:text-dark-link">
        <AiOutlineLoading3Quarters aria-hidden />
      </div>
    );

  return (
    <button
      aria-label={`${resolvedTheme === "light" ? "dark" : "light"} mode`}
      className="text-xl text-light-link transition-colors hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover"
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
