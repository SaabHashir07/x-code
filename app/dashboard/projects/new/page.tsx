"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/Button";

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError("Project name must be at least 2 characters.");
      return;
    }
    if (idea.trim().length < 10) {
      setError("Please describe your idea in more detail (10+ characters).");
      return;
    }

    setLoading(true);

    try {
      // Step 1: AI se plan generate karwao
      const aiRes = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, idea }),
      });

      const aiData = await aiRes.json();

      if (!aiRes.ok) {
        setError(aiData.error || "Failed to generate plan. Please try again.");
        setLoading(false);
        return;
      }

      const plan = aiData.plan;

      // Step 2: Database mein save karo
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Session expired. Please log in again.");
        setLoading(false);
        return;
      }

      const { data: project, error: dbError } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: name.trim(),
          idea: idea.trim(),
          plan: plan,
          status: "ready",
        })
        .select()
        .single();

      if (dbError) {
        setError(dbError.message);
        setLoading(false);
        return;
      }

      // Step 3: Project detail page pe redirect
      router.push(`/dashboard/projects/${project.id}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
        >
          <ArrowLeft size={14} />
          Back to projects
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-text-primary">
          New Project
        </h1>
        <p className="text-text-muted">
          Describe your idea. Our AI will turn it into a structured plan.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-2xl space-y-6 rounded-xl border border-border bg-surface p-6"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-text-primary"
          >
            Project name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Study Planner, Task Manager, Recipe App"
            disabled={loading}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="idea"
            className="block text-sm font-medium text-text-primary"
          >
            Describe your idea
          </label>
          <p className="mt-1 text-xs text-text-muted">
            The more detail you give, the better the AI plan.
          </p>
          <textarea
            id="idea"
            required
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g. A web app where students can plan their semester, track assignments, and get reminders for deadlines."
            rows={6}
            disabled={loading}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 resize-none"
          />
          <p className="mt-1 text-xs text-text-muted">
            {idea.length} characters
          </p>
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
          {loading ? (
            <>
              <Sparkles size={16} className="animate-pulse" />
              AI is analyzing your idea... (may take 10-20s)
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate with AI
            </>
          )}
        </Button>
      </form>
    </>
  );
}