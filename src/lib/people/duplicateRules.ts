/**
 * Duplicate detection for canonical people.
 * Never match on name alone.
 */

export type PersonMatchCandidate = {
  id: string;
  email_normalized: string | null;
  whatsapp_normalized: string | null;
  status?: string;
};

export type MatchInput = {
  emailNormalized: string | null;
  whatsappNormalized: string | null;
};

export type MatchResult =
  | { kind: "none" }
  | { kind: "email"; personId: string }
  | { kind: "whatsapp"; personId: string }
  | {
      kind: "conflict";
      emailPersonId: string;
      whatsappPersonId: string;
      /** Prefer email for attachment; flag for manual merge */
      attachPersonId: string;
    };

/**
 * Apply identity match rules against a list of candidate people rows.
 * Callers should load candidates by email and/or WhatsApp first.
 */
export function resolvePersonMatch(
  input: MatchInput,
  byEmail: PersonMatchCandidate | null,
  byWhatsapp: PersonMatchCandidate | null,
): MatchResult {
  const emailId =
    input.emailNormalized && byEmail?.status !== "merged"
      ? byEmail?.id
      : undefined;
  const waId =
    input.whatsappNormalized && byWhatsapp?.status !== "merged"
      ? byWhatsapp?.id
      : undefined;

  if (emailId && waId && emailId !== waId) {
    return {
      kind: "conflict",
      emailPersonId: emailId,
      whatsappPersonId: waId,
      attachPersonId: emailId,
    };
  }
  if (emailId) return { kind: "email", personId: emailId };
  if (waId) return { kind: "whatsapp", personId: waId };
  return { kind: "none" };
}

export function shouldCreateNewPerson(match: MatchResult): boolean {
  return match.kind === "none";
}
