import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  date: String,
  tooth: String,
  status: {
    type: String,
    enum: ['Confirmed', 'Pending', 'Cancelled'],
    default: 'Pending'
  },
});

const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

export default Booking;
