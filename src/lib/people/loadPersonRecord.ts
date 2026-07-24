/**
 * Load one person record for the v0.2.1 completion test:
 * identity, interest, applications, relationships, source history — no duplicates.
 */

import { getServiceSupabase } from "@/lib/supabase/server";

export type PersonRecordView = {
  person: {
    id: string;
    displayName: string;
    emailNormalized: string | null;
    whatsappNormalized: string | null;
    status: string;
    firstSource: string | null;
    createdAt: string;
  };
  profile: {
    id: string;
    email: string;
    fullName: string;
    status: string;
    authUserId: string | null;
    isSuperAdmin: boolean;
  } | null;
  relationships: {
    slug: string;
    status: string;
    startedAt: string;
  }[];
  interest: {
    id: string;
    eventId: string;
    eventName: string;
    createdAt: string;
  }[];
  applications: {
    id: string;
    applicationCode: string;
    status: string;
    createdAt: string;
  }[];
  sourceHistory: {
    action: string;
    objectType: string | null;
    objectId: string | null;
    matchMethod: string | null;
    at: string;
  }[];
};

export async function loadPersonRecord(
  personId: string,
): Promise<PersonRecordView | null> {
  const supabase = getServiceSupabase();
  if (!supabase) return null;

  const { data: person } = await supabase
    .from("people")
    .select(
      "id, display_name, email_normalized, whatsapp_normalized, status, first_source, created_at",
    )
    .eq("id", personId)
    .maybeSingle();

  if (!person) return null;

  const [
    { data: profiles },
    { data: relationships },
    { data: interest },
    { data: applications },
    { data: audit },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, full_name, status, auth_user_id, is_super_admin")
      .eq("person_id", personId)
      .limit(1),
    supabase
      .from("person_relationships")
      .select("relationship_slug, status, started_at")
      .eq("person_id", personId)
      .order("started_at", { ascending: false }),
    supabase
      .from("gathering_interest")
      .select("id, event_id, event_name, created_at")
      .eq("person_id", personId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("retreat_applications")
      .select("id, application_code, status, created_at")
      .eq("person_id", personId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("person_migration_audit")
      .select("action, object_type, object_id, match_method, created_at")
      .eq("person_id", personId)
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const profile = profiles?.[0] ?? null;

  return {
    person: {
      id: person.id,
      displayName: person.display_name,
      emailNormalized: person.email_normalized,
      whatsappNormalized: person.whatsapp_normalized,
      status: person.status,
      firstSource: person.first_source,
      createdAt: person.created_at,
    },
    profile: profile
      ? {
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name,
          status: profile.status,
          authUserId: profile.auth_user_id,
          isSuperAdmin: Boolean(profile.is_super_admin),
        }
      : null,
    relationships: (relationships ?? []).map((r) => ({
      slug: r.relationship_slug,
      status: r.status,
      startedAt: r.started_at,
    })),
    interest: (interest ?? []).map((i) => ({
      id: i.id,
      eventId: i.event_id,
      eventName: i.event_name,
      createdAt: i.created_at,
    })),
    applications: (applications ?? []).map((a) => ({
      id: a.id,
      applicationCode: a.application_code,
      status: a.status,
      createdAt: a.created_at,
    })),
    sourceHistory: (audit ?? []).map((a) => ({
      action: a.action,
      objectType: a.object_type,
      objectId: a.object_id,
      matchMethod: a.match_method,
      at: a.created_at,
    })),
  };
}

export async function listPeople(limit = 50) {
  const supabase = getServiceSupabase();
  if (!supabase) return [];

  const { data } = await supabase
    .from("people")
    .select(
      "id, display_name, email_normalized, whatsapp_normalized, status, first_source, created_at",
    )
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}
