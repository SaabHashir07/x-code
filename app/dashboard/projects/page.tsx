"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  FolderKanban,
  Sparkles,
  Trash2,
  ArrowRight,
  Clock,
  Layout,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/Button";

type Project = {
  id: string;
  name: string;
  idea: string;
  status: string;
  created_at: string;
};

export default function ProjectsListPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      supabase
        .from("projects")
        .select("id, name, idea, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data, error: e }) => {
          if (e) setError(e.message);
          else setProjects(data ?? []);
          setLoading(false);
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    const supabase = createClient();
    const { error: e } = await supabase.from("projects").delete().eq("id", id);
    if (e) {
      setError(e.message);
      return;
    }
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Projects</h1>
          <p className="mt-1 text-text-muted">
            {loading
              ? "Loading..."
              : `${projects.length} project${projects.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button href="/dashboard/projects/new" variant="primary">
          <Plus size={16} />
          New Project
        </Button>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-critical/30 bg-critical/10 px-3 py-2.5 text-sm text-critical">
          {error}
        </div>
      )}

      <div className="mt-8">
        {loading ? (
          <div className="rounded-xl border border-border bg-surface p-12 text-center text-sm text-text-muted">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
              <FolderKanban size={24} />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-text-primary">
              No projects yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
              Turn your first idea into a structured plan with AI. It takes
              less than a minute.
            </p>
            <div className="mt-6 flex justify-center">
              <Button href="/dashboard/projects/new" variant="primary">
                <Sparkles size={16} />
                Create Your First Project
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-1 hover:border-accent"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <FolderKanban size={18} />
                  </div>
                  <span className="rounded-md bg-success/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-success">
                    {project.status}
                  </span>
                </div>

                <button
                  onClick={() =>
                    router.push(`/dashboard/projects/${project.id}`)
                  }
                  className="mt-4 flex-1 text-left"
                >
                  <h3 className="text-base font-semibold text-text-primary transition-colors group-hover:text-accent">
                    {project.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-text-muted">
                    {project.idea}
                  </p>
                </button>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Clock size={12} />
                    {new Date(project.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/editor/${project.id}`)
                      }
                      className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-accent/10 hover:text-accent"
                      aria-label="Open editor"
                      title="Open in Editor"
                    >
                      <Layout size={14} />
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/dashboard/projects/${project.id}`)
                      }
                      className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-bg hover:text-text-primary"
                      aria-label="View plan"
                      title="View AI Plan"
                    >
                      <ArrowRight size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-critical/10 hover:text-critical"
                      aria-label="Delete project"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}