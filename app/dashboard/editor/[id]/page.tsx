import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditorLayout from "@/components/editor/EditorLayout";

export default async function EditorPage({
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

  return (
    <EditorLayout
      projectId={project.id}
      projectName={project.name}
      initialPages={project.pages}
    />
  );
}