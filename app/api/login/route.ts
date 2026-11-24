import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/db";
import Admin from "@/lib/models/Admin";
import { loginSchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { cookieOptions, SESSION_COOKIE, signSession } from "@/lib/session";
import { json, sameOrigin } from "@/lib/api";

// Compared against when the email is unknown, so timing doesn't reveal which emails exist.
const DUMMY_HASH = "$2a$10$CwTycUXWue0Thq9StjUM0uJ8.6Hq8mGv0mYbQ0kYb6bQ3oQ1m5Z6e";
const BAD_LOGIN = "Incorrect email or password.";

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ message: "Request blocked." }, 403);

  const limit = rateLimit(`login:${clientIp(req)}`, 8, 10 * 60 * 1000);
  if (!limit.ok) {
    return json({ message: "Too many attempts. Try again in a few minutes." }, 429, {
      "Retry-After": String(limit.retryAfter),
    });
  }

  const parsed = loginSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ message: BAD_LOGIN }, 401);

  try {
    await connectToDB();
    const admin = await Admin.findOne({ email: parsed.data.email });
    const ok = await bcrypt.compare(parsed.data.password, admin?.password ?? DUMMY_HASH);
    if (!admin || !ok) return json({ message: BAD_LOGIN }, 401);

    const token = await signSession({ sub: String(admin._id), email: admin.email });
    const res = json({ message: "Signed in." });
    res.cookies.set(SESSION_COOKIE, token, cookieOptions);
    return res;
  } catch (error) {
    console.error("Login failed:", error);
    return json({ message: "Something went wrong. Please try again." }, 500);
  }
}
