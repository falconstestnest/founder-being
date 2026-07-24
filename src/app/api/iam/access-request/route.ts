import { NextResponse } from "next/server";
import { z } from "zod";
import { allowLocalIamFallback } from "@/lib/iam/constants";
import { writeAuditEvent } from "@/lib/iam/authz";
import { SYSTEM_ROLE_SLUGS, requestableSystemRoles } from "@/lib/iam/roles";
import { saveAccessRequest } from "@/lib/iam/store";
import { normalizeEmail } from "@/lib/identity/normalize";
import { clientKey, rateLimit } from "@/lib/security/rateLimit";
import { getServiceSupabase } from "@/lib/supabase/server";

const schema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().transform((e) => normalizeEmail(e)),
  preferredRoles: z
    .array(z.enum(SYSTEM_ROLE_SLUGS as unknown as [string, ...string[]]))
    .min(1)
    .max(3),
  note: z.string().trim().max(1000).optional(),
  privacyConsent: z.literal(true),
  /** Honeypot — must be empty */
  website: z.string().max(0).optional(),
});

/**
 * Public access request.
 * - Rate limited
 * - Honeypot spam protection
 * - Duplicate email returns same success (no privileged-user enumeration)
 * - Does not assign roles or create accounts
 */
export async function POST(request: Request) {
  const rl = rateLimit({
    key: clientKey(request, "access-request"),
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSec || 3600) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the form.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const data = parsed.data;
  // Honeypot: bots fill hidden fields
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const allowed = new Set(requestableSystemRoles().map((r) => r.slug));
  const preferred = data.preferredRoles.filter((r) => allowed.has(r as never));
  if (preferred.length === 0) {
    return NextResponse.json(
      { error: "Select at least one preferred system role." },
      { status: 400 },
    );
  }

  const supabase = getServiceSupabase();
  if (supabase) {
    // Duplicate open request → success without revealing privileged access
    const { data: existing } = await supabase
      .from("access_requests")
      .select("id, status")
      .eq("email", data.email)
      .in("status", ["submitted", "pending", "under_review"])
      .limit(1)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ ok: true, id: existing.id, duplicate: true });
    }

    const { data: inserted, error } = await supabase
      .from("access_requests")
      .insert({
        full_name: data.fullName,
        email: data.email,
        preferred_role_slugs: preferred,
        note: data.note ?? null,
        status: "submitted",
      })
      .select("id")
      .single();

    if (error) {
      console.error("[iam:access-request]", error.message);
      // Unique violation or race → still generic success
      if (error.code === "23505") {
        return NextResponse.json({ ok: true });
      }
      return NextResponse.json(
        { error: "We couldn't submit your request. Please try again." },
        { status: 500 },
      );
    }

    await writeAuditEvent({
      action: "access_request.submitted",
      objectType: "access_request",
      objectId: inserted.id,
      meta: { preferredRoles: preferred },
    });

    // Confirmation email is operator-configured; do not fail the request if mail is off
    return NextResponse.json({ ok: true, id: inserted.id });
  }

  if (!allowLocalIamFallback()) {
    return NextResponse.json(
      {
        error:
          "Access requests are unavailable until the identity service is configured.",
      },
      { status: 503 },
    );
  }

  try {
    const row = await saveAccessRequest({
      fullName: data.fullName,
      email: data.email,
      preferredRoles: preferred as never,
      note: data.note,
    });
    return NextResponse.json({ ok: true, id: row.id });
  } catch (e) {
    // Local store may throw on duplicate — still generic success
    const message = e instanceof Error ? e.message : "";
    if (/exist|duplicate/i.test(message)) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { error: "We couldn't submit your request. Please try again." },
      { status: 400 },
    );
  }
}
