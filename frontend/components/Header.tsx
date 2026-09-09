"use client";

import { useCallback, useEffect, useState } from "react";

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = useCallback(() => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      html.classList.add("light");
      localStorage.setItem("scamguard-theme", "light");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      html.classList.remove("light");
      localStorage.setItem("scamguard-theme", "dark");
      setIsDark(true);
    }
  }, []);

  return (
    <header className="w-full bg-[var(--color-surface-lowest)] border-b border-[var(--color-outline-variant)] sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-5xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 text-[var(--color-on-surface)] hover:opacity-90 transition-opacity"
        >
          <div className="h-8 w-8 rounded bg-[var(--color-primary)] flex items-center justify-center">
            <span className="material-symbols-outlined text-[var(--color-on-primary)] text-[20px]">
              shield
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[19px] font-semibold tracking-tight leading-none">
              ScamGuard
            </span>
            <span className="text-[11px] text-[var(--color-outline)] font-medium tracking-normal mt-0.5">
              Personal Scam Defense
            </span>
          </div>
        </a>

        {/* Nav */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <a
            href="#how-it-works"
            className="text-[13px] sm:text-[14px] text-[var(--color-on-surface-variant)] hover:text-[var(--color-secondary)] transition-colors font-medium px-2.5 py-1.5 rounded-lg hover:bg-[var(--color-surface-low)]"
          >
            How It Works
          </a>
          <a
            href="#common-scams"
            className="text-[13px] sm:text-[14px] text-[var(--color-on-surface-variant)] hover:text-[var(--color-secondary)] transition-colors font-medium px-2.5 py-1.5 rounded-lg hover:bg-[var(--color-surface-low)]"
          >
            Common Scams
          </a>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle light and dark mode"
            title="Toggle Theme"
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface-low)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/50 cursor-pointer"
          >
            {isDark ? (
              /* Sun icon — shown in dark mode */
              <svg
                className="w-[18px] h-[18px]"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              /* Moon icon — shown in light mode */
              <svg
                className="w-[18px] h-[18px]"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
