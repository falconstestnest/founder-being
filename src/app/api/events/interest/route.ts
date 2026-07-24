import { NextResponse } from "next/server";
import { z } from "zod";
import {
  LEGACY_SLUG_MAP,
  getEventById,
  getEventBySlug,
} from "@/lib/events/catalog";
import {
  EVENT_TYPE_LABELS,
  REGISTRATION_WORKFLOW_LABELS,
} from "@/lib/events/taxonomy";
import {
  buildIdentityLinkKeys,
  normalizeEmail,
} from "@/lib/identity/normalize";
import {
  auditPersonLink,
  findOrCreatePerson,
  matchMethodFromResult,
} from "@/lib/people/personService";
import { getServiceSupabase } from "@/lib/supabase/server";

const schema = z.object({
  eventId: z.string().min(1),
  eventName: z.string().min(1),
  eventType: z.string().min(1),
  city: z.string().min(1),
  registrationWorkflow: z.string().min(1),
  eventSlug: z.string().optional(),
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().transform((e) => normalizeEmail(e)),
  whatsapp: z.string().trim().max(40).optional().nullable(),
  location: z.string().trim().max(120).optional().nullable(),
  company: z.string().trim().max(160).optional().nullable(),
  isFounder: z.string().optional().nullable(),
  note: z.string().trim().max(800).optional().nullable(),
  consent: z.boolean().optional(),
});

const COMMUNITY_ID = "evt_community_general";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 400 },
    );
  }

  const data = parsed.data;
  let slug = data.eventSlug;
  if (slug && LEGACY_SLUG_MAP[slug]) slug = LEGACY_SLUG_MAP[slug];

  if (data.eventId === COMMUNITY_ID || slug === "community") {
    return persist({
      event_id: COMMUNITY_ID,
      event_name: "Founder-Being Community",
      event_type: "Community",
      city: "Multiple",
      registration_workflow: "Community Signup",
      event_slug: "community",
      full_name: data.fullName,
      email: data.email,
      whatsapp: data.whatsapp || null,
      location: data.location || null,
      company: data.company || null,
      is_founder: data.isFounder || null,
      note: data.note || null,
      marketing_consent: Boolean(data.consent),
    });
  }

  const known =
    getEventById(data.eventId) ||
    (slug ? getEventBySlug(slug) : undefined);

  if (!known || known.id !== data.eventId) {
    return NextResponse.json({ error: "Unknown event." }, { status: 400 });
  }

  return persist({
    event_id: known.id,
    event_name: known.title,
    event_type: EVENT_TYPE_LABELS[known.eventType],
    city: known.location.city,
    registration_workflow:
      REGISTRATION_WORKFLOW_LABELS[known.registrationWorkflow],
    event_slug: known.slug,
    full_name: data.fullName,
    email: data.email,
    whatsapp: data.whatsapp || null,
    location: data.location || null,
    company: data.company || null,
    is_founder: data.isFounder || null,
    note: data.note || null,
    marketing_consent: Boolean(data.consent),
  });
}

async function persist(record: {
  event_id: string;
  event_name: string;
  event_type: string;
  city: string;
  registration_workflow: string;
  event_slug: string;
  full_name: string;
  email: string;
  whatsapp: string | null;
  location: string | null;
  company: string | null;
  is_founder: string | null;
  note: string | null;
  marketing_consent: boolean;
}) {
  const link = buildIdentityLinkKeys({
    email: record.email,
    whatsapp: record.whatsapp,
  });
  const whatsappNorm = link.whatsappNormalized || record.whatsapp;

  // Canonical person — not profiles (no login required for public interest)
  const person = await findOrCreatePerson({
    displayName: record.full_name,
    email: record.email,
    whatsapp: record.whatsapp,
    source: "gathering_interest",
    relationshipSlug: "member",
  });

  const row = {
    ...record,
    email: link.emailNormalized || record.email,
    whatsapp: whatsappNorm,
    person_id: person?.personId ?? null,
    created_at: new Date().toISOString(),
  };

  const supabase = getServiceSupabase();
  if (supabase) {
    const { data: inserted, error } = await supabase
      .from("gathering_interest")
      .insert(row)
      .select("id")
      .single();

    if (!error && inserted && person) {
      await auditPersonLink({
        action: "linked_interest",
        personId: person.personId,
        objectType: "gathering_interest",
        objectId: inserted.id,
        matchMethod: matchMethodFromResult(person.match),
        meta: { event_id: record.event_id, conflict: person.conflict },
      });
      return NextResponse.json({ ok: true, personId: person.personId });
    }
    if (error) console.error("[events:interest]", error.message);
    else if (!error) return NextResponse.json({ ok: true });
  }

  console.info("[founder-being:event-interest]", {
    event_id: row.event_id,
    event_type: row.event_type,
    city: row.city,
    emailDomain: row.email.split("@")[1],
    person_id: person?.personId ?? null,
  });

  return NextResponse.json({ ok: true, personId: person?.personId ?? null });
}
