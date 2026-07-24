/**
 * Ensure an active profile has a linked people row.
 * Call on successful auth / workspace resolve — not a CRM write path for public.
 */

import { findOrCreatePerson, auditPersonLink } from "@/lib/people/personService";
import { getServiceSupabase } from "@/lib/supabase/server";

export async function ensureProfilePerson(input: {
  profileId: string;
  email: string;
  fullName: string;
  relationshipSlug?: string | null;
  existingPersonId?: string | null;
}): Promise<string | null> {
  if (input.existingPersonId) return input.existingPersonId;

  const supabase = getServiceSupabase();
  if (!supabase) return null;

  // Re-read in case another request linked first
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, person_id, email, full_name, relationship_slug")
    .eq("id", input.profileId)
    .maybeSingle();

  if (!profile) return null;
  if (profile.person_id) return profile.person_id as string;

  const result = await findOrCreatePerson({
    displayName: input.fullName || (profile.full_name as string) || "User",
    email: input.email || (profile.email as string),
    source: "profile_bootstrap",
    relationshipSlug:
      input.relationshipSlug ??
      (profile.relationship_slug as string | null) ??
      null,
  });

  if (!result) return null;

  await supabase
    .from("profiles")
    .update({ person_id: result.personId })
    .eq("id", input.profileId)
    .is("person_id", null);

  await auditPersonLink({
    action: "profile_linked",
    personId: result.personId,
    objectType: "profile",
    objectId: input.profileId,
    matchMethod: result.created ? "created_new" : "email",
  });

  return result.personId;
}
