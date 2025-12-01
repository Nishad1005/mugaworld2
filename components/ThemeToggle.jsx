"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      className="fixed top-6 right-6 z-50 p-2 w-16 h-8 rounded-full border border-[var(--gold)] flex items-center justify-between px-3 text-xs transition-all hover:scale-110 bg-[var(--card)] shadow-lg"
      aria-label="Toggle theme"
    >
      <span className={theme === "light" ? "opacity-100" : "opacity-30"}>☀</span>
      <span className={theme === "dark" ? "opacity-100" : "opacity-30"}>🌙</span>
    </button>
  );
}
