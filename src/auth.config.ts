import type { NextAuthConfig } from "next-auth";

/** Edge-safe base config shared by proxy.ts and the full auth instance. */
export const authConfig = {
  trustHost: true,
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      if (pathname.startsWith("/admin/login")) return true;
      if (pathname.startsWith("/admin")) {
        return (auth?.user as { role?: string } | undefined)?.role === "admin";
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        const u = user as { id?: string; role?: string };
        token.id = u.id;
        token.role = u.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        Object.assign(session.user, { id: token.id, role: token.role });
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
