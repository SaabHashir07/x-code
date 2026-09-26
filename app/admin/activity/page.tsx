"use client";

import { useState, useEffect } from "react";
import { UserPlus, CheckCircle2, User as UserIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  full_name: string | null;
  role: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

export default function AdminActivityPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setProfiles(data ?? []);
        setLoading(false);
      });
  }, []);

  // Har user ke liye activity events banao
  function getActivities() {
    const events: {
      id: string;
      type: "signup" | "onboarding";
      name: string;
      timestamp: string;
    }[] = [];

    profiles.forEach((profile) => {
      // Signup event
      events.push({
        id: `${profile.id}-signup`,
        type: "signup",
        name: profile.full_name ?? "Unknown user",
        timestamp: profile.created_at,
      });

      // Onboarding event — agar completed hai aur time alag hai
      if (profile.onboarding_completed && profile.updated_at !== profile.created_at) {
        events.push({
          id: `${profile.id}-onboarding`,
          type: "onboarding",
          name: profile.full_name ?? "Unknown user",
          timestamp: profile.updated_at,
        });
      }
    });

    // Time ke hisaab se sort karo (latest first)
    return events.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  const activities = getActivities();

  function formatTime(timestamp: string) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-text-primary">Activity</h1>
        <p className="text-text-muted">
          Recent signups and platform events.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface">
        {loading ? (
          <div className="p-8 text-center text-sm text-text-muted">
            Loading activity...
          </div>
        ) : activities.length === 0 ? (
          <div className="p-8 text-center text-sm text-text-muted">
            No activity yet.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {activities.map((event) => (
              <li
                key={event.id}
                className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-bg/50 sm:px-6"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    event.type === "signup"
                      ? "bg-accent/10 text-accent"
                      : "bg-success/10 text-success"
                  }`}
                >
                  {event.type === "signup" ? (
                    <UserPlus size={16} />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary">
                    <span className="font-medium">{event.name}</span>{" "}
                    <span className="text-text-muted">
                      {event.type === "signup"
                        ? "signed up"
                        : "completed onboarding"}
                    </span>
                  </p>
                </div>
                <span className="shrink-0 text-xs text-text-muted">
                  {formatTime(event.timestamp)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}