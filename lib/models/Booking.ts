import mongoose, { Schema } from "mongoose";
import { STATUSES, type BookingStatus } from "@/lib/validation";

export interface IBooking {
  name: string;
  email: string;
  phone: string;
  /** ISO `YYYY-MM-DD`. Older records may hold `DD/MM/YYYY`; see lib/dates.ts. */
  date: string;
  tooth: string;
  note?: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 24 },
    date: { type: String, required: true },
    tooth: { type: String, required: true, maxlength: 60 },
    note: { type: String, trim: true, maxlength: 500, default: "" },
    status: { type: String, enum: STATUSES, default: "Pending", index: true },
  },
  { timestamps: true }
);

BookingSchema.index({ createdAt: -1 });

export default (mongoose.models.Booking as mongoose.Model<IBooking>) ||
  mongoose.model<IBooking>("Booking", BookingSchema);
