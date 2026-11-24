import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

/** Page-level gate for the admin area. API routes re-check the session themselves. */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/admin" && session) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }
  if (pathname.startsWith("/admin/dashboard") && !session) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin", "/admin/dashboard/:path*"] };
