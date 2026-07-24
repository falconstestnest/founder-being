import { NextResponse } from "next/server";
import {
  auditPersonLink,
  findOrCreatePerson,
  matchMethodFromResult,
} from "@/lib/people/personService";
import {
  applySchema,
  generateApplicationCode,
  toE164ish,
} from "@/lib/retreats/applySchema";
import { getServiceSupabase, isSupabaseConfigured } from "@/lib/supabase/server";

async function verifyTurnstile(token: string | undefined, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Allow local/dev without Turnstile; require in production when secret set.
    return process.env.NODE_ENV !== "production" || !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  }
  if (!token) return false;

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body },
  );
  const data = (await res.json()) as { success?: boolean };
  return Boolean(data.success);
}

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  // Lightweight non-reversible hash for abuse control (not crypto auth).
  let h = 0;
  for (let i = 0; i < ip.length; i++) h = (Math.imul(31, h) + ip.charCodeAt(i)) | 0;
  return `ip_${(h >>> 0).toString(16)}`;
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = applySchema.safeParse(json);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return NextResponse.json(
      { error: "Please check the form and try again.", fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Honeypot
  if (data.website) {
    return NextResponse.json({ ok: true, applicationCode: generateApplicationCode() });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip");

  const turnstileOk = await verifyTurnstile(data.turnstileToken, ip ?? null);
  if (!turnstileOk) {
    return NextResponse.json(
      { error: "Spam verification failed. Please try again." },
      { status: 400 },
    );
  }

  const applicationCode = generateApplicationCode();
  const phoneE164 = toE164ish(data.phone);
  const now = new Date().toISOString();

  const person = await findOrCreatePerson({
    displayName: data.fullName,
    email: data.email,
    whatsapp: phoneE164,
    source: "retreat_application",
    relationshipSlug: "member",
  });

  const record = {
    retreat_slug: data.retreatSlug,
    application_code: applicationCode,
    full_name: data.fullName,
    email_normalized: data.email,
    phone_e164: phoneE164,
    person_id: person?.personId ?? null,
    city_country: data.cityCountry,
    company_name: data.companyName,
    current_role: data.currentRole,
    linkedin_url: data.linkedinUrl ?? null,
    company_url: data.companyUrl ?? null,
    startup_stage: data.startupStage,
    motivation: data.motivation,
    desired_outcome: data.desiredOutcome,
    founder_context: data.founderContext ?? null,
    attended_before: data.attendedBefore === "yes",
    referral_source: data.referralSource ?? null,
    kochi_transport: data.kochiTransport,
    twin_sharing: data.twinSharing === "yes",
    dietary_basic: data.dietaryBasic ?? null,
    accessibility_basic: data.accessibilityBasic ?? null,
    privacy_consent_at: now,
    terms_consent_at: now,
    marketing_consent_at: data.marketingConsent ? now : null,
    status: "submitted",
    utm_source: data.utmSource ?? null,
    utm_medium: data.utmMedium ?? null,
    utm_campaign: data.utmCampaign ?? null,
    referrer: data.referrer ?? null,
    ip_hash: hashIp(ip ?? null),
    idempotency_key: data.idempotencyKey ?? null,
  };

  const supabase = getServiceSupabase();

  if (supabase) {
    // Resolve retreat id by slug
    const { data: retreat, error: retreatError } = await supabase
      .from("retreats")
      .select("id")
      .eq("slug", data.retreatSlug)
      .maybeSingle();

    if (retreatError || !retreat) {
      console.error("[retreat-apply] retreat lookup failed", retreatError?.message);
      return NextResponse.json(
        { error: "Retreat is not available for applications right now." },
        { status: 503 },
      );
    }

    // retreat_slug is not a column — strip before insert
    const { retreat_slug: _slug, ...applicationRow } = record;
    void _slug;

    const { data: inserted, error } = await supabase
      .from("retreat_applications")
      .insert({
        retreat_id: retreat.id,
        ...applicationRow,
      })
      .select("id, application_code")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error:
              "An application with this email or phone may already exist for this retreat. Contact us if you need to update it.",
          },
          { status: 409 },
        );
      }
      console.error("[retreat-apply] insert failed", error.message);
      return NextResponse.json(
        { error: "We couldn't submit your application. Please try again." },
        { status: 500 },
      );
    }

    if (person && inserted?.id) {
      await auditPersonLink({
        action: "linked_application",
        personId: person.personId,
        objectType: "retreat_application",
        objectId: inserted.id as string,
        matchMethod: matchMethodFromResult(person.match),
        meta: {
          application_code: inserted.application_code,
          conflict: person.conflict,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      applicationCode: inserted.application_code as string,
      personId: person?.personId ?? null,
    });
  }

  // Fallback when Supabase is not configured (preview / local): log without PII dump of free text.
  console.info("[retreat-apply] supabase not configured; accepted application", {
    applicationCode,
    emailDomain: data.email.split("@")[1],
    startupStage: data.startupStage,
    retreatSlug: data.retreatSlug,
    configured: isSupabaseConfigured(),
  });

  return NextResponse.json({
    ok: true,
    applicationCode,
    note: "stored-offline",
  });
}
