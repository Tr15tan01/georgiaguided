import type { Metadata } from "next";
import { ToastProvider } from "@/components/admin/toast";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · GeorgiaGuided Admin" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="adm min-h-dvh">
      <ToastProvider>{children}</ToastProvider>
    </div>
  );
}
