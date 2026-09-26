import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Layers,
  Database,
  Server,
  CheckSquare,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

type ProjectPlan = {
  summary: string;
  requirements: string[];
  architecture: {
    frontend: string;
    backend: string;
    database: string;
    hosting: string;
  };
  database_tables: {
    name: string;
    columns: string[];
  }[];
  api_endpoints: {
    method: string;
    path: string;
    description: string;
  }[];
  tasks: string[];
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !project) {
    notFound();
  }

  const plan = project.plan as ProjectPlan | null;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
        >
          <ArrowLeft size={14} />
          Back to dashboard
        </Link>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              {project.name}
            </h1>
            <p className="mt-2 max-w-2xl text-text-muted">
              {project.idea}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
            <Sparkles size={12} />
            AI Generated
          </span>
        </div>
      </div>

      {!plan ? (
        <div className="mt-10 rounded-xl border border-border bg-surface p-8 text-center text-text-muted">
          No AI plan available for this project.
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          {/* Summary */}
          <Section icon={FileText} title="Summary">
            <p className="text-sm leading-relaxed text-text-muted">
              {plan.summary}
            </p>
          </Section>

          {/* Requirements */}
          <Section icon={CheckSquare} title="Requirements">
            <ul className="space-y-2">
              {plan.requirements?.map((req, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-text-muted"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {req}
                </li>
              ))}
            </ul>
          </Section>

          {/* Architecture */}
          <Section icon={Layers} title="Architecture">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Frontend", value: plan.architecture?.frontend },
                { label: "Backend", value: plan.architecture?.backend },
                { label: "Database", value: plan.architecture?.database },
                { label: "Hosting", value: plan.architecture?.hosting },
              ].map(
                (item) =>
                  item.value && (
                    <div
                      key={item.label}
                      className="rounded-lg border border-border bg-bg p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm text-text-muted">
                        {item.value}
                      </p>
                    </div>
                  )
              )}
            </div>
          </Section>

          {/* Database Tables */}
          <Section icon={Database} title="Database Tables">
            <div className="space-y-3">
              {plan.database_tables?.map((table, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-bg p-4"
                >
                  <p className="font-mono text-sm font-semibold text-text-primary">
                    {table.name}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {table.columns?.map((col, j) => (
                      <span
                        key={j}
                        className="rounded-md bg-surface px-2 py-1 font-mono text-xs text-text-muted border border-border"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* API Endpoints */}
          <Section icon={Server} title="API Endpoints">
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-bg">
                  <tr className="text-left text-xs uppercase tracking-wide text-text-muted">
                    <th className="px-4 py-3 font-medium">Method</th>
                    <th className="px-4 py-3 font-medium">Path</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {plan.api_endpoints?.map((endpoint, i) => (
                    <tr key={i} className="transition-colors hover:bg-bg/50">
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-md px-2 py-0.5 font-mono text-xs font-semibold ${
                            endpoint.method === "GET"
                              ? "bg-accent/10 text-accent"
                              : endpoint.method === "POST"
                              ? "bg-success/10 text-success"
                              : endpoint.method === "DELETE"
                              ? "bg-critical/10 text-critical"
                              : "bg-warning/10 text-warning"
                          }`}
                        >
                          {endpoint.method}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-text-primary">
                        {endpoint.path}
                      </td>
                      <td className="px-4 py-3 text-text-muted">
                        {endpoint.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Tasks */}
          <Section icon={CheckSquare} title="Tasks">
            <ul className="space-y-2">
              {plan.tasks?.map((task, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-text-muted"
                >
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border" />
                  {task}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      )}
    </>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Icon size={18} />
        </div>
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}