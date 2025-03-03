import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Booking from "@/lib/models/Booking";

// Update booking status
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(params.id, { status }, { new: true });

    if (!updatedBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Booking updated successfully", booking: updatedBooking });
  } catch (error) {
    console.error("Update Booking Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
