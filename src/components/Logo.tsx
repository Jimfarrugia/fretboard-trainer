"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import lightLogo from "@/../public/light-logo-48x48.png";
import darkLogo from "@/../public/dark-logo-48x48.png";

export default function Logo() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <span className="loading loading-spinner loading-md text-light-darkerBg dark:text-dark-heading"></span>
    );

  return (
    <Image
      height={24}
      width={24}
      src={resolvedTheme === "dark" ? darkLogo : lightLogo}
      loading="lazy"
      alt="logo"
    />
  );
}
