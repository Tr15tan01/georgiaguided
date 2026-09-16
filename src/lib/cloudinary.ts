import "server-only";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { env } from "./env";

let configured = false;
function client() {
  const { cloudName, apiKey, apiSecret } = env.cloudinary;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.");
  }
  if (!configured) {
    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
    configured = true;
  }
  return cloudinary;
}

export function cloudinaryConfigured(): boolean {
  const { cloudName, apiKey, apiSecret } = env.cloudinary;
  return Boolean(cloudName && apiKey && apiSecret);
}

export async function uploadBuffer(buffer: Buffer, filename: string): Promise<UploadApiResponse> {
  const c = client();
  return new Promise((resolve, reject) => {
    const stream = c.uploader.upload_stream(
      {
        folder: env.cloudinary.folder,
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
        filename_override: filename,
        overwrite: false,
      },
      (err, result) => (err || !result ? reject(err ?? new Error("Upload failed")) : resolve(result)),
    );
    stream.end(buffer);
  });
}

export async function uploadFromUrl(url: string): Promise<UploadApiResponse> {
  return client().uploader.upload(url, { folder: env.cloudinary.folder, resource_type: "image" });
}

export async function destroyAsset(publicId: string): Promise<void> {
  await client().uploader.destroy(publicId, { resource_type: "image", invalidate: true });
}
