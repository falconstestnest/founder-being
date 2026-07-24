import { NextResponse } from "next/server";
import { z } from "zod";
import {
  communityCta,
  getGatheringById,
  getGatheringBySlug,
} from "@/lib/gatherings";
import { getServiceSupabase } from "@/lib/supabase/server";

const schema = z.object({
  eventId: z.string().min(1),
  eventName: z.string().min(1),
  eventType: z.string().min(1),
  city: z.string().min(1),
  registrationWorkflow: z.string().min(1),
  eventSlug: z.string().optional(),
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().transform((e) => e.toLowerCase()),
  whatsapp: z.string().trim().max(40).optional().nullable(),
  location: z.string().trim().max(120).optional().nullable(),
  company: z.string().trim().max(160).optional().nullable(),
  isFounder: z.string().optional().nullable(),
  note: z.string().trim().max(800).optional().nullable(),
  consent: z.boolean().optional(),
});

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

  // Validate event_id against known catalogue (prevents spoofed CMS tags)
  const known =
    getGatheringById(data.eventId) ||
    (data.eventSlug ? getGatheringBySlug(data.eventSlug) : undefined) ||
    (data.eventId === communityCta.id ? communityCta : undefined);

  if (!known || known.id !== data.eventId) {
    return NextResponse.json({ error: "Unknown gathering." }, { status: 400 });
  }

  const record = {
    event_id: known.id,
    event_name: known.title,
    event_type: known.eventType,
    city: known.city,
    registration_workflow: known.registrationWorkflow,
    event_slug: known.slug,
    full_name: data.fullName,
    email: data.email,
    whatsapp: data.whatsapp || null,
    location: data.location || null,
    company: data.company || null,
    is_founder: data.isFounder || null,
    note: data.note || null,
    marketing_consent: Boolean(data.consent),
    created_at: new Date().toISOString(),
  };

  const supabase = getServiceSupabase();
  if (supabase) {
    const { error } = await supabase.from("gathering_interest").insert(record);
    if (error) {
      console.error("[gatherings:interest]", error.message);
      // Fall through to log if table missing
    } else {
      return NextResponse.json({ ok: true });
    }
  }

  console.info("[founder-being:gathering-interest]", {
    event_id: record.event_id,
    event_name: record.event_name,
    event_type: record.event_type,
    city: record.city,
    registration_workflow: record.registration_workflow,
    emailDomain: data.email.split("@")[1],
    is_founder: record.is_founder,
    marketing_consent: record.marketing_consent,
  });

  return NextResponse.json({ ok: true });
}
