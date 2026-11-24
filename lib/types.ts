import type { BookingStatus } from "@/lib/validation";

export type BookingRecord = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  tooth: string;
  note?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
};
