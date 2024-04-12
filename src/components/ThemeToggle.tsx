"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <div className="text-xl text-light-link hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover">
        <AiOutlineLoading3Quarters />
      </div>
    );

  if (resolvedTheme === "light") {
    return (
      <button className="text-xl text-light-link hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover">
        <FiMoon onClick={() => setTheme("dark")} />
      </button>
    );
  }

  if (resolvedTheme === "dark") {
    return (
      <button className="text-xl text-light-link hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover">
        <FiSun onClick={() => setTheme("light")} />
      </button>
    );
  }
}
