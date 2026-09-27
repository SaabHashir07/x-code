import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = "https://ludyqlouajncrzqkqjgk.supabase.co";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params;
    const pathStr = path.join("/");
    const search = request.nextUrl.search;
    const targetUrl = `${SUPABASE_URL}/${pathStr}${search}`;

    console.log(`[proxy] ${request.method} ${targetUrl}`);

    // Forward all headers except problematic ones
    const forwardHeaders = new Headers();
    request.headers.forEach((value, key) => {
      const k = key.toLowerCase();
      // Skip hop-by-hop and problematic headers
      if (
        [
          "host",
          "connection",
          "content-length",
          "accept-encoding",
          "transfer-encoding",
        ].includes(k)
      ) {
        return;
      }
      forwardHeaders.set(key, value);
    });

    // Get body
    let bodyBuffer: ArrayBuffer | undefined;
    if (!["GET", "HEAD"].includes(request.method)) {
      bodyBuffer = await request.arrayBuffer();
    }

    // Fetch from Supabase
    const supabaseRes = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body: bodyBuffer,
      redirect: "manual",
    });

    console.log(
      `[proxy] Response ${supabaseRes.status} from Supabase`
    );

    // Build response with clean headers
    const responseHeaders = new Headers();
    supabaseRes.headers.forEach((value, key) => {
      const k = key.toLowerCase();
      if (
        ["content-encoding", "content-length", "transfer-encoding"].includes(k)
      ) {
        return;
      }
      responseHeaders.append(key, value);
    });

    // Forward cookies properly — this is CRITICAL for session
    const setCookies = supabaseRes.headers.getSetCookie?.() || [];
    setCookies.forEach((cookie) => {
      responseHeaders.append("set-cookie", cookie);
    });

    const body = await supabaseRes.arrayBuffer();

    return new NextResponse(body, {
      status: supabaseRes.status,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("[proxy] Error:", err);
    return NextResponse.json(
      {
        error: "Proxy failed",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const OPTIONS = handler;