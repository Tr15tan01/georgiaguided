import "server-only";

function optional(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() !== "" ? v.trim() : undefined;
}

export function required(name: string): string {
  const v = optional(name);
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

export const env = {
  get mongodbUri() {
    return required("MONGODB_URI");
  },
  cloudinary: {
    cloudName: optional("CLOUDINARY_CLOUD_NAME"),
    apiKey: optional("CLOUDINARY_API_KEY"),
    apiSecret: optional("CLOUDINARY_API_SECRET"),
    folder: optional("CLOUDINARY_FOLDER") ?? "georgiaguided",
  },
  resendApiKey: optional("RESEND_API_KEY"),
  emailFrom: optional("EMAIL_FROM") ?? "GeorgiaGuided <onboarding@resend.dev>",
  contactEmail: optional("CONTACT_EMAIL"),
  rateLimitSalt: optional("RATE_LIMIT_SALT") ?? "georgiaguided",
};
