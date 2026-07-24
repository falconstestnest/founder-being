/**
 * Canonical Person service.
 * profiles = access · people = institution human record.
 */

import {
  buildIdentityLinkKeys,
  normalizeEmail,
  normalizeWhatsApp,
} from "@/lib/identity/normalize";
import {
  resolvePersonMatch,
  type MatchResult,
} from "@/lib/people/duplicateRules";
import { getServiceSupabase } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export type FindOrCreatePersonInput = {
  displayName: string;
  email?: string | null;
  whatsapp?: string | null;
  source: string;
  /** Optional relationship to ensure on the person */
  relationshipSlug?: string | null;
};

export type FindOrCreatePersonResult = {
  personId: string;
  created: boolean;
  match: MatchResult;
  conflict: boolean;
};

async function writeAudit(
  supabase: SupabaseClient,
  row: {
    action: string;
    personId: string | null;
    objectType?: string;
    objectId?: string;
    matchMethod?: string;
    meta?: Record<string, unknown>;
  },
) {
  await supabase.from("person_migration_audit").insert({
    action: row.action,
    person_id: row.personId,
    object_type: row.objectType ?? null,
    object_id: row.objectId ?? null,
    match_method: row.matchMethod ?? null,
    meta: row.meta ?? {},
  });
}

/**
 * Find existing person by email / WhatsApp or create a new one.
 * Service role only. Never merges on name.
 */
export async function findOrCreatePerson(
  input: FindOrCreatePersonInput,
): Promise<FindOrCreatePersonResult | null> {
  const supabase = getServiceSupabase();
  if (!supabase) return null;

  const keys = buildIdentityLinkKeys({
    email: input.email,
    whatsapp: input.whatsapp,
  });

  if (!keys.emailNormalized && !keys.whatsappNormalized) {
    return null;
  }

  type PersonRow = {
    id: string;
    email_normalized: string | null;
    whatsapp_normalized: string | null;
    status: string;
  };

  let byEmail: PersonRow | null = null;
  let byWhatsapp: PersonRow | null = null;

  if (keys.emailNormalized) {
    const { data } = await supabase
      .from("people")
      .select("id, email_normalized, whatsapp_normalized, status")
      .eq("email_normalized", keys.emailNormalized)
      .eq("status", "active")
      .maybeSingle();
    byEmail = (data as PersonRow | null) ?? null;
  }

  if (keys.whatsappNormalized) {
    const { data } = await supabase
      .from("people")
      .select("id, email_normalized, whatsapp_normalized, status")
      .eq("whatsapp_normalized", keys.whatsappNormalized)
      .eq("status", "active")
      .maybeSingle();
    byWhatsapp = (data as PersonRow | null) ?? null;
  }

  const match = resolvePersonMatch(
    {
      emailNormalized: keys.emailNormalized,
      whatsappNormalized: keys.whatsappNormalized,
    },
    byEmail,
    byWhatsapp,
  );

  if (match.kind === "none") {
    const { data: created, error } = await supabase
      .from("people")
      .insert({
        display_name: input.displayName.trim() || "Unknown",
        email_normalized: keys.emailNormalized,
        whatsapp_normalized: keys.whatsappNormalized,
        primary_email: keys.emailNormalized,
        primary_whatsapp: keys.whatsappNormalized,
        first_source: input.source,
        status: "active",
      })
      .select("id")
      .single();

    if (error || !created) {
      // Race on unique email — re-fetch
      if (keys.emailNormalized) {
        const { data: again } = await supabase
          .from("people")
          .select("id")
          .eq("email_normalized", keys.emailNormalized)
          .eq("status", "active")
          .maybeSingle();
        if (again) {
          return {
            personId: again.id,
            created: false,
            match: { kind: "email", personId: again.id },
            conflict: false,
          };
        }
      }
      console.error("[people:findOrCreate]", error?.message);
      return null;
    }

    await writeAudit(supabase, {
      action: "person_created",
      personId: created.id,
      matchMethod: "created_new",
      meta: { source: input.source },
    });

    if (input.relationshipSlug) {
      await ensureRelationship(
        supabase,
        created.id,
        input.relationshipSlug,
        input.source,
      );
    }

    return {
      personId: created.id,
      created: true,
      match: { kind: "none" },
      conflict: false,
    };
  }

  const personId =
    match.kind === "conflict" ? match.attachPersonId : match.personId;
  const conflict = match.kind === "conflict";

  // Enrich WhatsApp if missing on email-matched person
  if (match.kind === "email" && keys.whatsappNormalized) {
    await supabase
      .from("people")
      .update({
        whatsapp_normalized: keys.whatsappNormalized,
        primary_whatsapp: keys.whatsappNormalized,
        updated_at: new Date().toISOString(),
      })
      .eq("id", personId)
      .is("whatsapp_normalized", null);
  }

  if (conflict) {
    await writeAudit(supabase, {
      action: "merge_conflict",
      personId,
      matchMethod: "conflict_email_whatsapp",
      meta: {
        emailPersonId: match.kind === "conflict" ? match.emailPersonId : null,
        whatsappPersonId:
          match.kind === "conflict" ? match.whatsappPersonId : null,
        source: input.source,
      },
    });
  }

  if (input.relationshipSlug) {
    await ensureRelationship(
      supabase,
      personId,
      input.relationshipSlug,
      input.source,
    );
  }

  return {
    personId,
    created: false,
    match,
    conflict,
  };
}

async function ensureRelationship(
  supabase: SupabaseClient,
  personId: string,
  relationshipSlug: string,
  source: string,
) {
  const { data: existing } = await supabase
    .from("person_relationships")
    .select("id")
    .eq("person_id", personId)
    .eq("relationship_slug", relationshipSlug)
    .eq("status", "active")
    .maybeSingle();

  if (existing) return;

  await supabase.from("person_relationships").insert({
    person_id: personId,
    relationship_slug: relationshipSlug,
    status: "active",
    source,
  });
}

export async function auditPersonLink(input: {
  action: string;
  personId: string;
  objectType: string;
  objectId: string;
  matchMethod: string;
  meta?: Record<string, unknown>;
}) {
  const supabase = getServiceSupabase();
  if (!supabase) return;
  await writeAudit(supabase, {
    action: input.action,
    personId: input.personId,
    objectType: input.objectType,
    objectId: input.objectId,
    matchMethod: input.matchMethod,
    meta: input.meta,
  });
}

export function matchMethodFromResult(match: MatchResult): string {
  if (match.kind === "none") return "created_new";
  if (match.kind === "conflict") return "conflict_email_prefer";
  return match.kind;
}

export { normalizeEmail, normalizeWhatsApp };
