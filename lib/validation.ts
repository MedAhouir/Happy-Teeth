import { z } from "zod";
import { TOOTHMAP } from "@/constants";

export const STATUSES = ["Pending", "Confirmed", "Cancelled"] as const;
export type BookingStatus = (typeof STATUSES)[number];

export const TOOTH_NAMES = Object.values(TOOTHMAP) as [string, ...string[]];

const todayISO = () => new Date().toISOString().slice(0, 10);

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(80, "Name is too long."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[+()\d\s.-]{7,24}$/, "Enter a valid phone number."),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date.")
    .refine((d) => d >= todayISO(), "Pick today or a future date."),
  tooth: z.enum(TOOTH_NAMES, { errorMap: () => ({ message: "Select a tooth on the chart." }) }),
  note: z.string().trim().max(500, "Keep notes under 500 characters.").optional().default(""),
  /** Honeypot: real people never fill this. */
  website: z.string().optional(),
});
export type BookingInput = z.infer<typeof bookingSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
});

export const adminSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(10, "Use at least 10 characters.").max(200),
  setupKey: z.string().optional(),
});

export const statusSchema = z.object({ status: z.enum(STATUSES) });
