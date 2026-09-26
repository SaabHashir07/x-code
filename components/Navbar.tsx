"use client";

import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Theme load karo
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  // Session check karo
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? null);
    });

    // Auth state change pe listener — login/logout pe turant update
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserEmail(null);
    router.push("/");
    router.refresh();
  }

  const links = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/#services" },
    { label: "How It Works", href: "/#how-it-works" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-xl font-bold text-text-primary">
          X Code
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-md p-2 text-text-muted transition-colors hover:bg-surface hover:text-text-primary"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {userEmail ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-md p-2 text-text-muted transition-colors hover:bg-surface hover:text-text-primary"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="rounded-md p-2 text-text-muted transition-colors hover:bg-surface hover:text-text-primary"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="border-t border-border bg-bg px-4 pb-4 md:hidden">
          <ul className="flex flex-col gap-1 pt-2">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-surface hover:text-text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
            {userEmail ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-center text-sm font-medium text-text-primary transition-colors hover:bg-surface"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="rounded-lg bg-accent px-4 py-2 text-center text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-center text-sm font-medium text-text-primary transition-colors hover:bg-surface"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg bg-accent px-4 py-2 text-center text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}