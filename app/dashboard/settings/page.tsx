"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/Button";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email ?? "");

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (profile) {
          setName(profile.full_name ?? "");
        }
      }

      setLoading(false);
    }

    load();
  }, []);

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
        <p className="mt-1 text-text-muted">
          Manage your account information.
        </p>
      </div>

      <div className="mt-8 max-w-2xl space-y-6">
        {/* Profile card */}
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-text-primary">
            Profile
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Your account information.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary">
                Full name
              </label>
              <input
                type="text"
                value={loading ? "Loading..." : name || "(not set)"}
                disabled
                className="mt-2 w-full cursor-not-allowed rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-muted disabled:opacity-70"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary">
                Email
              </label>
              <input
                type="email"
                value={loading ? "Loading..." : email}
                disabled
                className="mt-2 w-full cursor-not-allowed rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-muted disabled:opacity-70"
              />
            </div>
          </div>

          <p className="mt-5 text-xs text-text-muted">
            Editing coming soon. For now, contact admin to update your info.
          </p>
        </div>

        {/* Danger zone */}
        <div className="rounded-xl border border-critical/30 bg-surface p-6">
          <h2 className="text-lg font-semibold text-critical">
            Danger Zone
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Irreversible actions. Be careful.
          </p>

          <div className="mt-5">
            <Button variant="secondary" disabled>
              Delete account (coming soon)
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}