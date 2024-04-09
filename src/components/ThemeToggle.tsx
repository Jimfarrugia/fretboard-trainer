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
      <div className="text-lg">
        <AiOutlineLoading3Quarters />
      </div>
    );

  if (resolvedTheme === "light") {
    return (
      <button className="text-lg">
        <FiMoon onClick={() => setTheme("dark")} />
      </button>
    );
  }

  if (resolvedTheme === "dark") {
    return (
      <button className="text-lg">
        <FiSun onClick={() => setTheme("light")} />
      </button>
    );
  }
}
