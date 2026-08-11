import { NextRequest, NextResponse } from "next/server";

// Proxies browser requests to the real Enginex backend. This exists so the
// browser only ever talks to our own origin: the backend has no CORS headers
// and is plain HTTP, so calling it directly from client code would be blocked
// (CORS) or flagged (mixed content) depending on how this app is deployed.
const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://54.254.242.254/api";

async function forward(request: NextRequest, path: string[]) {
  const targetUrl = `${BACKEND_API_URL}/${path.join("/")}${request.nextUrl.search}`;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const authorization = request.headers.get("authorization");
  if (authorization) headers.set("authorization", authorization);
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);

  const hasBody = !["GET", "HEAD"].includes(request.method);

  let backendResponse: Response;
  try {
    backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: hasBody ? await request.text() : undefined,
      redirect: "manual",
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { success: false, status: 502, message: "Unable to reach the backend service." },
      { status: 502 }
    );
  }

  const responseBody = await backendResponse.text();
  const response = new NextResponse(responseBody, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
  });

  const responseContentType = backendResponse.headers.get("content-type");
  if (responseContentType) response.headers.set("content-type", responseContentType);

  for (const setCookie of backendResponse.headers.getSetCookie()) {
    response.headers.append("set-cookie", setCookie);
  }

  return response;
}

export async function GET(request: NextRequest, ctx: RouteContext<"/api/backend/[...path]">) {
  const { path } = await ctx.params;
  return forward(request, path);
}

export async function POST(request: NextRequest, ctx: RouteContext<"/api/backend/[...path]">) {
  const { path } = await ctx.params;
  return forward(request, path);
}

export async function PUT(request: NextRequest, ctx: RouteContext<"/api/backend/[...path]">) {
  const { path } = await ctx.params;
  return forward(request, path);
}

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/backend/[...path]">) {
  const { path } = await ctx.params;
  return forward(request, path);
}

export async function DELETE(request: NextRequest, ctx: RouteContext<"/api/backend/[...path]">) {
  const { path } = await ctx.params;
  return forward(request, path);
}
