export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True once Supabase credentials are present. The public site falls back to seed content until then. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
export const isCloudinaryConfigured = Boolean(
  cloudinaryCloudName && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET,
);
