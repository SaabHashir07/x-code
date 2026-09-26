import Button from "@/components/Button";

export default function DashboardPage() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-muted">
          Welcome back. Here's what's happening.
        </p>
      </div>

      <div className="mt-10 rounded-xl border border-border bg-surface p-8 text-center">
        <h2 className="text-xl font-semibold text-text-primary">
          No projects yet
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Create your first project to get started with X Code.
        </p>
        <div className="mt-6 flex justify-center">
          <Button href="/dashboard/projects/new" variant="primary">
            Create Your First Project
          </Button>
        </div>
      </div>
    </>
  );
}