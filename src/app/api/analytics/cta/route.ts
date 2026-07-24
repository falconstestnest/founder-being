import { NextResponse } from "next/server";
import { z } from "zod";
import { CTA_EVENTS } from "@/lib/analytics/cta";

const schema = z.object({
  event: z.enum(CTA_EVENTS as unknown as [string, ...string[]]),
  at: z.string().optional(),
  cta_name: z.string().min(1).max(120),
  source_page: z.string().max(300).optional(),
  event_id: z.string().max(120).nullable().optional(),
  event_type: z.string().max(80).nullable().optional(),
  registration_workflow: z.string().max(80).nullable().optional(),
  authenticated: z.boolean().optional(),
  workspace: z.string().max(80).nullable().optional(),
  error_code: z.string().max(80).nullable().optional(),
  meta: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});

/**
 * Lightweight CTA sink — logs structured events.
 * Wire to warehouse / Supabase later without changing client taxonomy.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid event." }, { status: 400 });
  }

  console.info(
    "[cta]",
    JSON.stringify({
      ...parsed.data,
      at: parsed.data.at ?? new Date().toISOString(),
    }),
  );

  return NextResponse.json({ ok: true });
}
