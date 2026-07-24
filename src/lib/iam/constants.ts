/** Bootstrap identity — assigned only via DB migration / server bootstrap, never email match. */
export const SUPER_ADMIN = {
  fullName: "Jimmy James",
  email: "jimmymanalel@gmail.com",
  systemRoleSlug: "super_administrator" as const,
  status: "active" as const,
  protected: true,
} as const;

export function getSuperAdminEmail() {
  return (
    process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase() || SUPER_ADMIN.email
  );
}

/** Local file-store IAM is never allowed in production. */
export function allowLocalIamFallback() {
  if (process.env.NODE_ENV === "production") return false;
  if (process.env.DISABLE_LOCAL_IAM === "1") return false;
  return process.env.ALLOW_LOCAL_IAM === "1";
}

export function isSupabaseAuthConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
