import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = "https://ludyqlouajncrzqkqjgk.supabase.co";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const pathStr = path.join("/");
  const search = request.nextUrl.search;
  const targetUrl = `${SUPABASE_URL}/${pathStr}${search}`;

  // Forward headers (skip problematic ones)
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (["host", "connection", "content-length", "accept-encoding"].includes(k)) return;
    headers.set(key, value);
  });

  // Get body for non-GET requests
  let body: BodyInit | undefined;
  if (!["GET", "HEAD"].includes(request.method)) {
    body = await request.arrayBuffer();
  }

  // Forward to Supabase
  const res = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
  });

  // Forward response (skip compression headers)
  const responseHeaders = new Headers();
  res.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (["content-encoding", "content-length", "transfer-encoding"].includes(k)) return;
    responseHeaders.set(key, value);
  });

  // Return response
  const resBody = await res.arrayBuffer();
  return new NextResponse(resBody, {
    status: res.status,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;
export const OPTIONS = proxy;