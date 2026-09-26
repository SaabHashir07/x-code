import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ============ PROVIDER HELPERS ============

async function tryGemini(prompt: string, apiKey: string): Promise<string | null> {
  const models = [
    "gemini-1.5-flash-8b",
    "gemini-1.5-flash",
    "gemini-2.0-flash",
    "gemini-flash-latest",
  ];
  let quotaExceeded = false;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`Gemini: Trying ${model} (attempt ${attempt})`);
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.3,
                maxOutputTokens: 8192,
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            console.log(`Gemini: Success with ${model}`);
            return text;
          }
        }

        const errText = await res.text();
        console.error(`Gemini (${model}) ${res.status}:`, errText.slice(0, 150));

        if (res.status === 429) quotaExceeded = true;
        if (res.status === 404) break;
        if ([400, 401, 403].includes(res.status)) break;
        if (attempt === 1) await new Promise((r) => setTimeout(r, 1500));
      } catch (e) {
        console.error(`Gemini error (${model}):`, e);
      }
    }
    if (quotaExceeded) break;
  }
  return null;
}

async function tryOpenAICompatible(
  providerName: string,
  endpoint: string,
  apiKey: string,
  models: string[],
  prompt: string
): Promise<string | null> {
  for (const model of models) {
    try {
      console.log(`${providerName}: Trying ${model}`);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: "You return only valid JSON. No markdown, no explanation.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 8192,
          response_format: { type: "json_object" },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) {
          console.log(`${providerName}: Success with ${model}`);
          return text;
        }
      }

      const errText = await res.text();
      console.error(
        `${providerName} (${model}) ${res.status}:`,
        errText.slice(0, 150)
      );

      // 404 = model not found, try next
      // 401/403 = auth issue, try next (maybe next key works)
      // 402 = payment required, break this provider
      if (res.status === 402) {
        console.log(`${providerName}: No credits, skipping`);
        return null;
      }
    } catch (e) {
      console.error(`${providerName} error (${model}):`, e);
    }
  }
  return null;
}

async function tryOpenRouter(prompt: string, apiKey: string) {
  return tryOpenAICompatible(
    "OpenRouter",
    "https://openrouter.ai/api/v1/chat/completions",
    apiKey,
    [
      "meta-llama/llama-3.3-70b-instruct:free",
      "google/gemini-2.0-flash-exp:free",
      "deepseek/deepseek-chat-v3-0324:free",
      "qwen/qwen-2.5-72b-instruct:free",
      "meta-llama/llama-3.1-8b-instruct:free",
    ],
    prompt
  );
}

async function tryDeepSeek(prompt: string, apiKey: string) {
  return tryOpenAICompatible(
    "DeepSeek",
    "https://api.deepseek.com/v1/chat/completions",
    apiKey,
    ["deepseek-chat", "deepseek-reasoner"],
    prompt
  );
}

async function tryGrok(prompt: string, apiKey: string) {
  return tryOpenAICompatible(
    "Grok",
    "https://api.x.ai/v1/chat/completions",
    apiKey,
    ["grok-beta", "grok-2-1212"],
    prompt
  );
}

// ============ MAIN ROUTE ============

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please log in again." },
        { status: 401 }
      );
    }

    const { instruction, data } = await request.json();
    if (!instruction || !data) {
      return NextResponse.json(
        { error: "Missing instruction or data." },
        { status: 400 }
      );
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const grokKey = process.env.GROK_API_KEY;

    const prompt = `You are an AI website editor. Modify the JSON design based on the user instruction.

Current design JSON:
${JSON.stringify(data)}

User instruction: "${instruction}"

Return ONLY the modified design JSON. Same schema, same version. No markdown, no code fences.

Rules:
- Component types: navbar, hero, features, text, image, button, footer, pricing, testimonial, cta, stats, gallery, contact, faq, team, logos, video, divider
- Every component: {id, type, props: {}, style: {}}
- Style options: align, paddingTop, paddingBottom, bgColor, textColor, fontSize
- Preserve all existing pages/components unless asked to delete
- New component IDs: "c_" + Date.now() + random

Return ONLY valid JSON.`;

    let resultText: string | null = null;
    let serviceUsed = "";

    // 1. Gemini (free)
    if (!resultText && geminiKey) {
      resultText = await tryGemini(prompt, geminiKey);
      if (resultText) serviceUsed = "Gemini";
    }

    // 2. OpenRouter (free models)
    if (!resultText && openrouterKey) {
      resultText = await tryOpenRouter(prompt, openrouterKey);
      if (resultText) serviceUsed = "OpenRouter";
    }

    // 3. DeepSeek (paid, cheap)
    if (!resultText && deepseekKey) {
      resultText = await tryDeepSeek(prompt, deepseekKey);
      if (resultText) serviceUsed = "DeepSeek";
    }

    // 4. Grok (may have credits)
    if (!resultText && grokKey) {
      resultText = await tryGrok(prompt, grokKey);
      if (resultText) serviceUsed = "Grok";
    }

    if (!resultText) {
      return NextResponse.json(
        {
          error:
            "All AI providers failed. Check terminal for details. Try again in 1-2 minutes.",
        },
        { status: 502 }
      );
    }

    // Parse JSON — sometimes wrapped in ```json
    let newData;
    try {
      const cleaned = resultText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();
      newData = JSON.parse(cleaned);
    } catch (e) {
      console.error("Parse fail:", resultText.slice(0, 500));
      return NextResponse.json(
        { error: "AI returned invalid format. Try again." },
        { status: 502 }
      );
    }

    console.log(`AI Edit: Success via ${serviceUsed}`);
    return NextResponse.json({ data: newData, service: serviceUsed });
  } catch (err) {
    console.error("AI Edit error:", err);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}