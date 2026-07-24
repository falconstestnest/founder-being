/** Bootstrap Super Administrator — cannot be removed via UI. */
export const SUPER_ADMIN = {
  fullName: "Jimmy James",
  email: "jimmymanalel@gmail.com",
  roleSlug: "super_administrator",
  status: "active" as const,
} as const;

export function getSuperAdminEmail() {
  return (
    process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase() || SUPER_ADMIN.email
  );
}

export function isSuperAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  return email.trim().toLowerCase() === getSuperAdminEmail();
}
