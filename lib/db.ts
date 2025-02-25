import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

export const connectToDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log(`Connected to database`)
    } catch (error) {
        console.error("Error connecting to database: ", error)
        process.exit(1)
    }
};
