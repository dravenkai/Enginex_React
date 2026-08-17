import { NextRequest, NextResponse } from "next/server";

// Proxies browser requests to the real Enginex backend. This exists so the
// browser only ever talks to our own origin.
const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "https://api.enginexmm.tech/api";

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
      // Stream the request body through unchanged instead of decoding it as
      // text — .text() forces a UTF-8 round-trip that corrupts any binary
      // body (multipart image uploads, raw image bytes), which broke every
      // image endpoint (POST /images/*, POST /users/profile-image, POST
      // /uploads/images) even though the browser sent the bytes correctly.
      body: hasBody ? request.body : undefined,
      // Node's fetch (undici) requires this whenever the body is a stream.
      // @ts-expect-error - `duplex` isn't in the DOM RequestInit typings yet
      duplex: hasBody ? "half" : undefined,
      redirect: "manual",
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { success: false, status: 502, message: "Unable to reach the backend service." },
      { status: 502 }
    );
  }

  // Same corruption risk on the way back — read as raw bytes, not text, so
  // binary responses (e.g. GET /images/{resource}/{id} image bytes) survive
  // the round-trip intact. Works fine for JSON/text responses too, since the
  // consuming side (rawRequest) reads the proxied response back via .text().
  const responseBody = await backendResponse.arrayBuffer();
  // The Response constructor throws if given a body alongside a null-body
  // status (204/205/304), even an empty one — which crashed every
  // successful 204 (e.g. DELETE endpoints) into an uncaught 500 here.
  const isNullBodyStatus = [204, 205, 304].includes(backendResponse.status);
  const response = new NextResponse(isNullBodyStatus ? null : responseBody, {
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
