"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    // Login success — dashboard pe bhejo
    router.push("/dashboard");
    router.refresh(); // Navbar ko session refresh karne ke liye
  }

  return (
    <>
      <Navbar />
      <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-text-primary">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Log in to continue to X Code.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 rounded-xl border border-border bg-surface p-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-text-primary"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-accent hover:text-accent-hover"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-critical/30 bg-critical/10 px-3 py-2.5 text-sm text-critical">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>

            <p className="text-center text-sm text-text-muted">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-accent hover:text-accent-hover"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </main>
    </>
  );
}