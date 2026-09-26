"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setSuccess(true);
  }

  // Success screen
  if (success) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-2xl text-success">
              ✓
            </div>
            <h1 className="mt-5 text-2xl font-bold text-text-primary">
              Check your email
            </h1>
            <p className="mt-3 text-sm text-text-muted">
              We sent a confirmation link to{" "}
              <strong className="text-text-primary">{email}</strong>. Click it to
              activate your account.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block text-sm font-medium text-accent hover:text-accent-hover"
            >
              Back to login
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-text-primary">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Start building with X Code in seconds.
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-primary"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label
                htmlFor="confirm"
                className="block text-sm font-medium text-text-primary"
              >
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
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
              {loading ? "Creating account..." : "Create account"}
            </Button>

            <p className="text-center text-sm text-text-muted">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-accent hover:text-accent-hover"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </main>
    </>
  );
}