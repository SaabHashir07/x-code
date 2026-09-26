"use client";

import { useState, useEffect } from "react";
import { FolderKanban, Users, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminProjectsPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    completedOnboarding: 0,
    totalProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchStats() {
      // Total users count
      const { count: userCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Completed onboarding count
      const { count: onboardedCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("onboarding_completed", true);

      setStats({
        totalUsers: userCount ?? 0,
        completedOnboarding: onboardedCount ?? 0,
        totalProjects: 0, // Phase 6 mein real hoga
      });
      setLoading(false);
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
    },
    {
      label: "Onboarded Users",
      value: stats.completedOnboarding,
      icon: TrendingUp,
    },
    {
      label: "Total Projects",
      value: stats.totalProjects,
      icon: FolderKanban,
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-text-primary">Projects</h1>
        <p className="text-text-muted">
          Platform-wide statistics and project overview.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-muted">
                  {stat.label}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon size={18} />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold text-text-primary">
                {loading ? "—" : stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Placeholder */}
      <div className="mt-10 rounded-xl border border-dashed border-border bg-surface/50 p-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-bg text-text-muted">
          <FolderKanban size={22} />
        </div>
        <h2 className="mt-5 text-lg font-semibold text-text-primary">
          Projects coming soon
        </h2>
        <p className="mt-2 text-sm text-text-muted max-w-md mx-auto">
          Users will be able to create projects from their dashboard. Once
          they do, they'll appear here with detailed stats and analytics.
        </p>
      </div>
    </>
  );
}