import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { MediaLibrary } from "@/components/admin/media-library";
import { cloudinaryConfigured } from "@/lib/cloudinary";

export const metadata: Metadata = { title: "Media" };

export default function MediaPage() {
  return (
    <>
      <PageHeader
        title="Media library"
        description="Upload photographs, write alt text, and remove images that are no longer used."
        crumbs={[{ href: "/admin/media", label: "Media" }]}
      />
      {!cloudinaryConfigured() && (
        <p className="adm-card mb-4 border-brass bg-brass/10 p-4 text-sm">
          Cloudinary isn&apos;t configured, so uploads are disabled. Add <code>CLOUDINARY_CLOUD_NAME</code>, <code>CLOUDINARY_API_KEY</code> and <code>CLOUDINARY_API_SECRET</code> to the environment.
        </p>
      )}
      <MediaLibrary />
    </>
  );
}
