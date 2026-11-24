import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "ht_session";
export const SESSION_MAX_AGE = 60 * 60 * 24; // 1 day

export type Session = { sub: string; email: string };

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set. Copy .env.example to .env.local and fill it in.");
  if (process.env.NODE_ENV === "production" && s.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters in production.");
  }
  return new TextEncoder().encode(s);
}

export async function signSession(session: Session) {
  return new SignJWT({ email: session.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret());
}

export async function verifySession(token: string | undefined | null): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    if (!payload.sub) return null;
    return { sub: payload.sub, email: String(payload.email ?? "") };
  } catch {
    return null;
  }
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
