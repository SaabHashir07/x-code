"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  FolderKanban,
  Activity,
  ArrowLeft,
  Menu,
  X,
  Sun,
  Moon,
  Shield,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type AdminShellProps = {
  children: React.ReactNode;
  userEmail: string;
};

export default function AdminShell({
  children,
  userEmail,
}: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const navLinks = [
    { label: "Overview", href: "/admin", icon: Shield },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Projects", href: "/admin/projects", icon: FolderKanban },
    { label: "Activity", href: "/admin/activity", icon: Activity },
  ];

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

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

  const sidebarContent = (
    <>
      {/* Logo + Admin badge */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Link href="/" className="text-xl font-bold text-text-primary">
          X Code
        </Link>
        <span className="rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
          ADMIN
        </span>
      </div>

      {/* Back to dashboard */}
      <div className="border-b border-border p-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-text-muted transition-colors hover:bg-surface hover:text-text-primary"
        >
          <ArrowLeft size={14} />
          Back to dashboard
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 p-3">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-text-muted hover:bg-surface hover:text-text-primary"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: user + logout */}
      <div className="border-t border-border p-3">
        <div className="mb-2 truncate rounded-lg px-3 py-2 text-xs text-text-muted">
          {userEmail}
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface hover:text-text-primary"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border bg-bg md:flex">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-bg md:hidden">
            {sidebarContent}
          </aside>
        </>
      )}

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-bg/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="rounded-md p-2 text-text-muted transition-colors hover:bg-surface hover:text-text-primary md:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <span className="text-sm font-medium text-text-muted">
              Admin Workspace
            </span>
          </div>

          <button
            onClick={toggleTheme}
            className="rounded-md p-2 text-text-muted transition-colors hover:bg-surface hover:text-text-primary"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}