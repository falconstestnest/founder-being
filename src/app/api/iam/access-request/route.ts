import { NextResponse } from "next/server";
import { z } from "zod";
import { ROLE_SLUGS, requestableRoles } from "@/lib/iam/roles";
import { saveAccessRequest } from "@/lib/iam/store";
import { getServiceSupabase } from "@/lib/supabase/server";

const schema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().transform((e) => e.toLowerCase()),
  preferredRoles: z
    .array(z.enum(ROLE_SLUGS as unknown as [string, ...string[]]))
    .min(1)
    .max(3),
  note: z.string().trim().max(1000).optional(),
  website: z.string().max(0).optional(),
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
      { error: "Please check the form.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const allowed = new Set(requestableRoles().map((r) => r.slug));
  const preferred = data.preferredRoles.filter((r) => allowed.has(r as never));
  if (preferred.length === 0) {
    return NextResponse.json(
      { error: "Select at least one requestable role." },
      { status: 400 },
    );
  }

  const supabase = getServiceSupabase();
  if (supabase) {
    const { data: inserted, error } = await supabase
      .from("access_requests")
      .insert({
        full_name: data.fullName,
        email: data.email,
        preferred_role_slugs: preferred,
        note: data.note ?? null,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      console.error("[iam:access-request]", error.message);
      return NextResponse.json(
        { error: "We couldn't submit your request. Please try again." },
        { status: 500 },
      );
    }
    return NextResponse.json({ ok: true, id: inserted.id });
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
    const message = e instanceof Error ? e.message : "Request failed.";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
