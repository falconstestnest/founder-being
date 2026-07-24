import { NextResponse } from "next/server";
import { z } from "zod";
import { EVENT_LIFECYCLE } from "@/lib/events/taxonomy";
import { applyLifecycleTransition } from "@/lib/events/transitionService";
import { AuthzError, requireAuthz, writeAuditEvent } from "@/lib/iam/authz";

const schema = z.object({
  to: z.enum(EVENT_LIFECYCLE as unknown as [string, ...string[]]),
  reason: z.string().trim().max(500).optional().nullable(),
  allowLiveOverride: z.boolean().optional(),
  unresolvedRefunds: z.number().int().min(0).optional(),
  activeFollowUps: z.number().int().min(0).optional(),
});

type RouteCtx = { params: Promise<{ eventId: string }> };

/**
 * POST /api/events/[eventId]/lifecycle
 * Guarded Event lifecycle transition + append-only audit.
 * Does not create participation or touch the Person graph.
 *
 * Permission: events.edit (publish uses events.publish when targeting published+)
 */
export async function POST(request: Request, context: RouteCtx) {
  try {
    const { eventId } = await context.params;
    if (!eventId) {
      return NextResponse.json({ error: "Event id required." }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid transition payload.", fieldErrors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { to, reason, allowLiveOverride, unresolvedRefunds, activeFollowUps } =
      parsed.data;

    // Publish-class transitions require publish permission; others need edit
    const publishTargets = new Set([
      "published",
      "interest_collection",
      "applications_open",
      "live",
    ]);
    const permission = publishTargets.has(to) ? "events.publish" : "events.edit";
    const authz = await requireAuthz(permission);

    // Live override only for super admin / elevated publish
    if (allowLiveOverride && !authz.isSuperAdmin) {
      return NextResponse.json(
        { error: "Live date override requires Super Administrator." },
        { status: 403 },
      );
    }

    const result = await applyLifecycleTransition({
      eventId,
      to: to as (typeof EVENT_LIFECYCLE)[number],
      actorProfileId: authz.profileId,
      reason,
      allowLiveOverride: Boolean(allowLiveOverride && authz.isSuperAdmin),
      unresolvedRefunds,
      activeFollowUps,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, errors: result.errors },
        { status: result.status },
      );
    }

    await writeAuditEvent({
      actorProfileId: authz.profileId,
      action: "event.lifecycle_transition",
      objectType: "event",
      objectId: result.eventId,
      meta: {
        from: result.from,
        to: result.to,
        auditId: result.auditId,
        reason: reason ?? null,
      },
    });

    return NextResponse.json({
      ok: true,
      eventId: result.eventId,
      from: result.from,
      to: result.to,
      auditId: result.auditId,
    });
  } catch (e) {
    if (e instanceof AuthzError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    console.error("[api:lifecycle]", e);
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
