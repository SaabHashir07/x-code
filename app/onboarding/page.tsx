"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("developer");
  const [purpose, setPurpose] = useState("");
  const [preferredTech, setPreferredTech] = useState("");

  // Pehle check karo ke user logged in hai
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setChecking(false);
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (fullName.trim().length < 2) {
      setError("Please enter your full name");
      return;
    }
    if (purpose.trim().length < 5) {
      setError("Please describe your purpose in a few words");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Session expired. Please log in again.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fullName,
        role: "user",
        purpose,
        preferred_tech: preferredTech,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (checking) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[80vh] items-center justify-center">
          <p className="text-text-muted">Loading...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-text-primary">
              Welcome to X Code
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Tell us a bit about yourself so we can personalize your
              workspace.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 rounded-xl border border-border bg-surface p-6"
          >
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-text-primary"
              >
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-text-primary"
              >
                Your role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              >
                <option value="student">Student</option>
                <option value="developer">Developer</option>
                <option value="founder">Founder</option>
                <option value="freelancer">Freelancer</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="purpose"
                className="block text-sm font-medium text-text-primary"
              >
                Main purpose
              </label>
              <textarea
                id="purpose"
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="What are you planning to build with X Code?"
                rows={3}
                className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
              />
            </div>

            <div>
              <label
                htmlFor="preferredTech"
                className="block text-sm font-medium text-text-primary"
              >
                Preferred technology{" "}
                <span className="text-text-muted font-normal">(optional)</span>
              </label>
              <input
                id="preferredTech"
                type="text"
                value={preferredTech}
                onChange={(e) => setPreferredTech(e.target.value)}
                placeholder="e.g. Next.js, React, Python"
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
              {loading ? "Saving..." : "Continue to dashboard"}
            </Button>
          </form>
        </div>
      </main>
    </>
  );
}