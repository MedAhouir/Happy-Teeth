import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectToDB } from "@/lib/db";
import Booking from "@/lib/models/Booking";
import { statusSchema } from "@/lib/validation";
import { isResponse, json, requireAdmin, sameOrigin } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

async function guard(req: NextRequest, ctx: Ctx) {
  if (!sameOrigin(req)) return { error: json({ error: "Request blocked." }, 403) };
  const session = await requireAdmin(req);
  if (isResponse(session)) return { error: session };
  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) return { error: json({ error: "Invalid appointment id." }, 400) };
  return { id };
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const g = await guard(req, ctx);
  if ("error" in g) return g.error;

  const parsed = statusSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: "Status must be Pending, Confirmed or Cancelled." }, 400);

  try {
    await connectToDB();
    const booking = await Booking.findByIdAndUpdate(g.id, { status: parsed.data.status }, { new: true }).lean();
    if (!booking) return json({ error: "Appointment not found." }, 404);
    return json({ booking });
  } catch (error) {
    console.error("Booking update failed:", error);
    return json({ error: "Could not update the appointment." }, 500);
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const g = await guard(req, ctx);
  if ("error" in g) return g.error;

  try {
    await connectToDB();
    const removed = await Booking.findByIdAndDelete(g.id).lean();
    if (!removed) return json({ error: "Appointment not found." }, 404);
    return json({ ok: true });
  } catch (error) {
    console.error("Booking delete failed:", error);
    return json({ error: "Could not delete the appointment." }, 500);
  }
}
