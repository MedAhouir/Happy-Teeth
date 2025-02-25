import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Booking from "@/lib/models/Booking";

export async function POST(req: Request) {
  try {
    await connectToDB();
    
    const { name, email, phone, date, tooth } = await req.json();

    if (!name || !email || !phone || !date || !tooth) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newBooking = new Booking({ name, email, phone, date, tooth });
    await newBooking.save();

    return NextResponse.json({ message: "Booking saved successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Booking API Error:", error); // Logs the error to the console
    return NextResponse.json({ error: error instanceof Error ? error.message : "Server error" }, { status: 500 });
  }
  
}
