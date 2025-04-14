import { NextResponse, type NextRequest } from "next/server";
import { connectToDB } from "@/lib/db";
import Booking from "@/lib/models/Booking";

// Corrected function signature
export async function PATCH(
  req: NextRequest,
  context: { params?: { id?: string } } // Ensure `params` exists to prevent type errors
) {
  try {
    await connectToDB();
    const { status } = await req.json();

    // Validate required fields
    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    // Validate ID existence
    if (!context.params?.id) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    // Update booking in MongoDB
    const updatedBooking = await Booking.findByIdAndUpdate(
      context.params.id,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Update Booking Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
