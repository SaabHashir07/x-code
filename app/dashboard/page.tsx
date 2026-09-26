import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Button from "@/components/Button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Server-side protection — agar user logged in nahi, login page pe bhejo
  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-text-primary">
            Dashboard
          </h1>
          <p className="text-text-muted">
            Welcome, <span className="text-text-primary font-medium">{user.email}</span>
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
            <Button variant="primary">Create Your First Project</Button>
          </div>
        </div>
      </main>
    </>
  );
}