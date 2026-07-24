/**
 * Identity linking helpers for public form → later sign-in merge.
 * Match on verified email, normalized WhatsApp, auth user id — never name alone.
 */

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Normalize WhatsApp / phone to digits with optional leading +.
 * Strips spaces, dashes, parentheses. Does not invent country codes.
 */
export function normalizeWhatsApp(input: string): string {
  const raw = input.trim();
  if (!raw) return "";
  const hasPlus = raw.startsWith("+");
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return hasPlus ? `+${digits}` : digits;
}

export type IdentityLinkKeys = {
  emailNormalized: string | null;
  whatsappNormalized: string | null;
  authUserId: string | null;
};

export function buildIdentityLinkKeys(input: {
  email?: string | null;
  whatsapp?: string | null;
  authUserId?: string | null;
}): IdentityLinkKeys {
  return {
    emailNormalized: input.email ? normalizeEmail(input.email) : null,
    whatsappNormalized: input.whatsapp
      ? normalizeWhatsApp(input.whatsapp)
      : null,
    authUserId: input.authUserId ?? null,
  };
}

/**
 * Confidence order for automatic linking (never name-only):
 * 1. auth_user_id (after sign-in)
 * 2. verified email match
 * 3. normalized WhatsApp match
 * Manual merge required for duplicates / conflicts.
 */
export const IDENTITY_LINK_PRIORITY = [
  "auth_user_id",
  "verified_email",
  "normalized_whatsapp",
  "manual_merge",
] as const;
