import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role === "admin") redirect("/admin");
  return (
    <main className="grid min-h-dvh lg:grid-cols-[1fr_minmax(0,32rem)]">
      <div className="relative hidden overflow-hidden bg-[#1e1b18] lg:block" aria-hidden>
        <svg viewBox="0 0 800 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2530" /><stop offset="1" stopColor="#6b1f3a" /></linearGradient>
          </defs>
          <rect width="800" height="900" fill="url(#sky)" />
          <path d="M0 620 L140 430 L220 520 L360 300 L470 470 L560 380 L800 640 L800 900 L0 900Z" fill="#151517" opacity=".75" />
          <path d="M340 330 L360 300 L382 334 L368 326 L356 340Z" fill="#ece6dc" opacity=".8" />
          <path d="M0 720 L180 600 L330 690 L520 560 L800 740 L800 900 L0 900Z" fill="#0e0e10" />
        </svg>
        <div className="absolute bottom-12 left-12 max-w-sm text-[#ece6dc]">
          <p className="font-display text-4xl leading-tight">Every journey begins with a well-kept house.</p>
          <p className="mt-3 text-sm opacity-70">GeorgiaGuided content studio</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <p className="font-display text-3xl">GeorgiaGuided</p>
          <h1 className="mt-6 text-xl font-semibold">Sign in to the admin</h1>
          <p className="mt-1 text-sm text-ink-soft">For team members only.</p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
