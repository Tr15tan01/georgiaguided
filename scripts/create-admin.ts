/**
 * Create or update the admin account from environment variables.
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
 * Usage: npm run admin:create            (creates if missing)
 *        npm run admin:create -- --reset-password
 */
import "./load-env";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Admin } from "../src/models";

export async function ensureAdmin({ resetPassword = false } = {}) {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";
  const name = process.env.ADMIN_NAME?.trim() || "Administrator";
  if (!email || !password) {
    console.warn("⚠ ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin account.");
    return;
  }
  if (password.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  const existing = await Admin.findOne({ email });
  if (existing && !resetPassword) {
    console.log(`✓ Admin ${email} already exists (password unchanged).`);
    return;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.updateOne({ email }, { $set: { email, name, passwordHash, role: "admin" } }, { upsert: true });
  console.log(existing ? `✓ Password reset for ${email}.` : `✓ Admin ${email} created.`);
}

const isMain = process.argv[1]?.includes("create-admin");
if (isMain) {
  (async () => {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not set.");
    await mongoose.connect(process.env.MONGODB_URI);
    await ensureAdmin({ resetPassword: process.argv.includes("--reset-password") });
    await mongoose.disconnect();
  })().catch((err) => {
    console.error("✗", err.message);
    process.exit(1);
  });
}
