"use client";

import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  full_name: string | null;
  role: string;
  purpose: string | null;
  preferred_tech: string | null;
  onboarding_completed: boolean;
  created_at: string;
};

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all");

  // Supabase se saare users fetch karo
  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError) {
          setError(fetchError.message);
        } else {
          setProfiles(data ?? []);
        }
        setLoading(false);
      });
  }, []);

  // Search + filter apply karo (client-side)
  const filtered = useMemo(() => {
    return profiles.filter((profile) => {
      // Role filter
      if (roleFilter !== "all" && profile.role !== roleFilter) {
        return false;
      }
      // Search filter — name ya email match
      if (search.trim()) {
        const q = search.toLowerCase();
        const name = (profile.full_name ?? "").toLowerCase();
        // Note: email profiles table mein nahi hai — kyunki woh auth.users mein hai
        // Isliye hum sirf name se search kar rahe hain abhi
        return name.includes(q) || profile.id.toLowerCase().includes(q);
      }
      return true;
    });
  }, [profiles, search, roleFilter]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-text-primary">Users</h1>
        <p className="text-text-muted">
          {loading ? "Loading..." : `${filtered.length} user${filtered.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Search + filter bar */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        {/* Role filter */}
        <select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(e.target.value as "all" | "user" | "admin")
          }
          className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        >
          <option value="all">All roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-lg border border-critical/30 bg-critical/10 px-3 py-2.5 text-sm text-critical">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
        {loading ? (
          <div className="p-8 text-center text-sm text-text-muted">
            Loading users...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-text-muted">
            {search || roleFilter !== "all"
              ? "No users match your filters."
              : "No users yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-bg/50">
                <tr className="text-left text-xs uppercase tracking-wide text-text-muted">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Purpose</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((profile) => (
                  <tr
                    key={profile.id}
                    className="transition-colors hover:bg-bg/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                          {(profile.full_name ?? "?").charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-text-primary">
                          {profile.full_name ?? "(no name)"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${
                          profile.role === "admin"
                            ? "bg-accent/10 text-accent"
                            : "bg-bg text-text-muted border border-border"
                        }`}
                      >
                        {profile.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      <span className="line-clamp-1">
                        {profile.purpose ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {new Date(profile.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}