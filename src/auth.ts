import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { connectDB } from "@/lib/db";
import { Admin, Activity } from "@/models";
import { recordHit, underLimit } from "@/lib/rate-limit";

const LOGIN_LIMIT = 8;
const LOGIN_WINDOW = 15 * 60;

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(1).max(200),
});

class TooManyAttempts extends CredentialsSignin {
  code = "rate_limited";
}

// Constant-time-ish dummy hash so unknown emails take as long as known ones.
let dummyHash: string | null = null;
const getDummyHash = () => (dummyHash ??= bcrypt.hashSync(crypto.randomUUID(), 12));

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        // Only failed attempts count, so a legitimate admin is never locked out by signing in often.
        if (!(await underLimit("login", LOGIN_LIMIT, LOGIN_WINDOW))) throw new TooManyAttempts();
        await connectDB();
        const admin = await Admin.findOne({ email: parsed.data.email }).select("+passwordHash");
        const ok = await bcrypt.compare(parsed.data.password, admin?.passwordHash ?? getDummyHash());
        if (!admin || !ok) {
          await recordHit("login", LOGIN_WINDOW);
          return null;
        }
        admin.lastLoginAt = new Date();
        await admin.save();
        await Activity.create({ action: "login", entity: "admin", actor: admin.email, label: admin.name });
        return { id: String(admin._id), email: admin.email, name: admin.name, role: admin.role };
      },
    }),
  ],
});
