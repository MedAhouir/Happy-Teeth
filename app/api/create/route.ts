import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Admin from "../../../lib/models/Admin";
import { connectToDB } from "../../../lib/db";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const { email, password } = await req.json(); // Parse the incoming JSON data

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
    }

    await connectToDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ success: false, message: "Admin already exists" }, { status: 409 });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin document
    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();

    return NextResponse.json({ success: true, message: "Admin created successfully" }, { status: 201 });

  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
