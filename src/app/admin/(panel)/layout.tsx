import { requireAdminPage } from "@/lib/auth-guard";
import { connectDB } from "@/lib/db";
import { Inquiry } from "@/models";
import { AdminSidebar } from "@/components/admin/sidebar";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdminPage();
  await connectDB();
  const newInquiries = await Inquiry.countDocuments({ status: "NEW" });
  return (
    <div className="lg:grid lg:grid-cols-[15.5rem_minmax(0,1fr)]">
      <AdminSidebar admin={{ name: admin.name, email: admin.email }} newInquiries={newInquiries} />
      <main id="main" className="min-w-0 px-4 pb-16 pt-6 sm:px-8 lg:pt-8">{children}</main>
    </div>
  );
}
