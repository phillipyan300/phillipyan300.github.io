"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/reading", label: "Reading" },
  { href: "/writing", label: "Writing" },
];

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  if (!mounted) return <div className="h-6 w-11" />;

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
      style={{ backgroundColor: dark ? "#3f3f46" : "#d4d4d8" }}
    >
      <span
        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-200 text-xs"
        style={{ transform: dark ? "translateX(22px)" : "translateX(2px)" }}
      >
        {dark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 z-40 w-full border-b border-zinc-200 bg-[#faf8f4]/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Phillip Yan
        </Link>
        <div className="flex items-center gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors hover:text-zinc-900 dark:hover:text-zinc-100 ${
                pathname === href
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://twitter.com/PhillipYan2"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            @phillipyan2
          </a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
