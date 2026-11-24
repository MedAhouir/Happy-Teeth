import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectToDB } from "@/lib/db";
import Booking from "@/lib/models/Booking";
import { bookingSchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { isResponse, json, requireAdmin, sameOrigin } from "@/lib/api";

/** Public: a patient requests an appointment. */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "Request blocked." }, 403);

  const limit = rateLimit(`book:${clientIp(req)}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return json(
      { error: "Too many requests. Please try again in a few minutes." },
      429,
      { "Retry-After": String(limit.retryAfter) }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    const fields = parsed.error.flatten().fieldErrors;
    return json({ error: Object.values(fields).flat()[0] ?? "Check the form and try again.", fields }, 400);
  }

  // Honeypot tripped: pretend it worked so bots learn nothing.
  if (parsed.data.website) return json({ message: "Request received." }, 201);

  try {
    await connectToDB();
    const { website: _website, ...data } = parsed.data;
    void _website;
    await Booking.create(data);
    return json({ message: "Request received." }, 201);
  } catch (error) {
    console.error("Booking create failed:", error);
    return json({ error: "We couldn't save your request. Please try again shortly." }, 500);
  }
}

/** Admin only: list appointment requests, newest first. */
export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (isResponse(session)) return session;

  try {
    await connectToDB();
    const docs = await Booking.find().sort({ createdAt: -1 }).limit(2000).select("-__v").lean();
    // Bookings saved by the first version of the site have no timestamps; an ObjectId encodes its creation time.
    const bookings = docs.map((b) => {
      const created = b.createdAt ?? new mongoose.Types.ObjectId(String(b._id)).getTimestamp();
      return { ...b, createdAt: created, updatedAt: b.updatedAt ?? created };
    });
    return json(bookings);
  } catch (error) {
    console.error("Booking list failed:", error);
    return json({ error: "Could not load appointments." }, 500);
  }
}
