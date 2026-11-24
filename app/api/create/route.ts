import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/db";
import Admin from "@/lib/models/Admin";
import { adminSchema } from "@/lib/validation";
import { SESSION_COOKIE, verifySession } from "@/lib/session";
import { json, sameOrigin } from "@/lib/api";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const isProd = process.env.NODE_ENV === "production";

/** Tells the setup screen whether the very first admin still has to be created. */
export async function GET() {
  try {
    await connectToDB();
    const needsSetup = (await Admin.estimatedDocumentCount()) === 0;
    return json({ needsSetup, requiresKey: isProd || Boolean(process.env.ADMIN_SETUP_KEY) });
  } catch {
    return json({ needsSetup: false, requiresKey: true });
  }
}

/**
 * Create an admin.
 * - Signed-in admins can add teammates.
 * - The first admin can be created once, with ADMIN_SETUP_KEY (required in production).
 * Previously this endpoint was open to anyone.
 */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ message: "Request blocked." }, 403);
  const limit = rateLimit(`admin:${clientIp(req)}`, 10, 60 * 60 * 1000);
  if (!limit.ok) return json({ message: "Too many attempts. Try again later." }, 429);

  const parsed = adminSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return json({ message: parsed.error.issues[0]?.message ?? "Check the form and try again." }, 400);
  }
  const { email, password, setupKey } = parsed.data;

  try {
    await connectToDB();
    const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);

    if (!session) {
      const isFirst = (await Admin.estimatedDocumentCount()) === 0;
      if (!isFirst) return json({ message: "Sign in to add team members." }, 401);

      const expected = process.env.ADMIN_SETUP_KEY;
      if (isProd && !expected) {
        return json({ message: "Setup is disabled. Run `npm run seed:admin` on the server instead." }, 403);
      }
      if (expected && setupKey !== expected) return json({ message: "Setup key is incorrect." }, 403);
    }

    if (await Admin.exists({ email })) return json({ message: "An admin with this email already exists." }, 409);

    await Admin.create({ email, password: await bcrypt.hash(password, 12) });
    return json({ message: "Admin created." }, 201);
  } catch (error) {
    console.error("Create admin failed:", error);
    return json({ message: "Something went wrong. Please try again." }, 500);
  }
}
