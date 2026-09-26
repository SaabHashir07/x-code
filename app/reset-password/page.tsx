"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Supabase email link se session create karta hai automatically.
  // Hum onAuthStateChange se wait karte hain jab tak session ready na ho.
  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });

    // Fallback — agar session already mojood hai
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    // Success — dashboard pe bhejo
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <>
      <Navbar />
      <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-text-primary">
              Set new password
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Choose a strong password for your account.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 rounded-xl border border-border bg-surface p-6"
          >
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-primary"
              >
                New password
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
                Confirm new password
              </label>
              <input
                id="confirm"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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
              disabled={loading || !ready}
            >
              {loading ? "Updating..." : ready ? "Update password" : "Verifying link..."}
            </Button>

            <p className="text-center text-sm text-text-muted">
              <Link
                href="/login"
                className="font-medium text-accent hover:text-accent-hover"
              >
                Back to login
              </Link>
            </p>
          </form>
        </div>
      </main>
    </>
  );
}