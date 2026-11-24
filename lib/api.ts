import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession, type Session } from "@/lib/session";

export const json = (body: unknown, status = 200, headers?: HeadersInit) =>
  NextResponse.json(body, { status, headers });

/** Every admin endpoint calls this. Middleware is a convenience, this is the real gate. */
export async function requireAdmin(req: NextRequest): Promise<Session | NextResponse> {
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session) return json({ error: "Not signed in." }, 401);
  return session;
}

/** Blocks cross-site form posts against cookie-authenticated endpoints. */
export function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser clients
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

export const isResponse = (v: unknown): v is NextResponse => v instanceof NextResponse;
