import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, idea } = body as { name?: string; idea?: string };

    if (!name || !idea) {
      return NextResponse.json(
        { error: "Project name and idea are required." },
        { status: 400 }
      );
    }

    if (idea.length < 10) {
      return NextResponse.json(
        { error: "Please describe your idea in more detail (10+ characters)." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service not configured. Contact admin." },
        { status: 500 }
      );
    }

    const prompt = `You are a senior software architect and UI designer. Analyze this project and return a structured plan.

Project: "${name}"
Idea: "${idea}"

Return ONLY valid JSON (no markdown, no code fences) with this structure:
{
  "summary": "One paragraph summary",
  "recommended_design": {
    "theme": "modern-minimal | bold-startup | corporate-trust | playful-creative | elegant-luxury",
    "primary_color": "#hex color code",
    "secondary_color": "#hex color code",
    "background_color": "#hex color code",
    "font_style": "One of: Inter, Geist, Poppins, Roboto, Manrope",
    "design_notes": "1 sentence on overall visual direction"
  },
  "recommended_tools": [
    {"name": "Tool name", "purpose": "Why this tool"}
  ],
  "requirements": ["req 1", "req 2", "req 3", "req 4", "req 5"],
  "architecture": {
    "frontend": "Recommended stack + why",
    "backend": "Recommended stack + why",
    "database": "Recommended + why",
    "hosting": "Recommended approach"
  },
  "database_tables": [
    {"name": "table1", "columns": ["col1 type", "col2 type"]},
    {"name": "table2", "columns": ["col1 type", "col2 type"]}
  ],
  "api_endpoints": [
    {"method": "GET", "path": "/api/example", "description": "What it does"},
    {"method": "POST", "path": "/api/example", "description": "What it does"}
  ],
  "tasks": ["task 1", "task 2", "task 3", "task 4", "task 5", "task 6"]
}

Pick 3-4 recommended_tools. Be concise.`;

    const models = [
      "gemini-1.5-flash-8b",
      "gemini-1.5-flash",
      "gemini-2.0-flash",
      "gemini-flash-latest",
      "gemini-3.8-flash",
    ];

    let geminiRes: Response | null = null;
    let lastErrText = "";
    let success = false;

    for (const model of models) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                  responseMimeType: "application/json",
                  temperature: 0.7,
                  maxOutputTokens: 2048,
                },
              }),
            }
          );

          if (geminiRes.ok) {
            success = true;
            break;
          }

          lastErrText = await geminiRes.text();
          console.error(
            `Gemini error (${model}, attempt ${attempt}):`,
            lastErrText.slice(0, 200)
          );

          if (geminiRes.status === 404) break;
          if ([400, 401, 403, 429].includes(geminiRes.status)) break;

          if (attempt === 1) {
            await new Promise((r) => setTimeout(r, 2000));
          }
        } catch (fetchErr) {
          console.error(`Fetch error (${model}):`, fetchErr);
        }
      }

      if (success) break;
    }

    if (!success || !geminiRes || !geminiRes.ok) {
      const isDev = process.env.NODE_ENV === "development";
      return NextResponse.json(
        {
          error: isDev
            ? `All models busy. Last error: ${lastErrText.slice(0, 200)}`
            : "AI service is experiencing high demand. Please try again in 5-10 minutes.",
        },
        { status: 502 }
      );
    }

    const geminiData = await geminiRes.json();
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json(
        { error: "AI returned an empty response. Please try again." },
        { status: 502 }
      );
    }

    let plan;
    try {
      plan = JSON.parse(text);
    } catch {
      console.error("Failed to parse AI response:", text.slice(0, 500));
      return NextResponse.json(
        { error: "AI returned invalid format. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ plan });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}