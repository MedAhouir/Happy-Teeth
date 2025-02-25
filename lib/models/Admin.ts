import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  password: string;
}

const AdminSchema = new Schema<IAdmin>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

export default mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);
