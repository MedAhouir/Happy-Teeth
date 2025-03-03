import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDB } from "../../../lib/db"; // Import DB connection logic
import Admin from "../../../lib/models/Admin"; // Admin model

// Ensure JWT_SECRET and JWT_EXPIRES_IN are defined in your environment variables
const JWT_SECRET = process.env.JWT_SECRET as string; ;

// If JWT_SECRET is not defined, throw an error
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

// Named export for POST method
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    await connectToDB();

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Email or password is incorrect" }, { status: 401 });
    }

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "1d" });

    return NextResponse.json({ message: "Admin logged in successfully", token }, { status: 200 });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

