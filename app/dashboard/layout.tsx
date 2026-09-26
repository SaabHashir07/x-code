import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.onboarding_completed) {
    redirect("/onboarding");
  }

  return (
    <DashboardShell
      userEmail={user.email ?? ""}
      userName={profile.full_name ?? "User"}
      isAdmin={profile.role === "admin"}
    >
      {children}
    </DashboardShell>
  );
}