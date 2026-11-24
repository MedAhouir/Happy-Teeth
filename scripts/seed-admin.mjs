// Usage: npm run seed:admin -- you@clinic.com "a-long-password"
// Reads MONGODB_URI from .env.local (or the environment).
import fs from "node:fs";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

for (const file of [".env.local", ".env"]) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  }
}

const [email, password] = process.argv.slice(2);
if (!email || !password || password.length < 10) {
  console.error('Usage: npm run seed:admin -- <email> "<password, 10+ characters>"');
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is missing. Add it to .env.local first.");
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);
const Admin = mongoose.model(
  "Admin",
  new mongoose.Schema({ email: { type: String, unique: true, lowercase: true, trim: true }, password: String }, { timestamps: true })
);
const normalized = email.trim().toLowerCase();
const hash = await bcrypt.hash(password, 12);
await Admin.findOneAndUpdate({ email: normalized }, { email: normalized, password: hash }, { upsert: true });
console.log(`Admin ready: ${normalized}`);
await mongoose.disconnect();
