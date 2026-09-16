import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

/** Gate every /admin route (except the login page) before rendering. */
export const proxy = auth;

export const config = {
  matcher: ["/admin/:path*"],
};
