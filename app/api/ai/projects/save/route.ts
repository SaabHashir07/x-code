import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, pages } = await request.json();

    if (!projectId || !pages) {
      return NextResponse.json(
        { error: "Missing projectId or pages" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("projects")
      .update({
        pages,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Save error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Editor page ka cache clear karo taake refresh pe fresh data milay
    revalidatePath(`/dashboard/editor/${projectId}`);

    return NextResponse.json({
      success: true,
      savedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Save route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}