import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthzError, requireAuthz, writeAuditEvent } from "@/lib/iam/authz";
import { allowLocalIamFallback } from "@/lib/iam/constants";
import { SYSTEM_ROLE_SLUGS } from "@/lib/iam/roles";
import { updateAccessRequest } from "@/lib/iam/store";
import { getServiceSupabase } from "@/lib/supabase/server";

const schema = z.object({
  action: z.enum(["approve", "reject"]),
  assignedRole: z
    .enum(SYSTEM_ROLE_SLUGS as unknown as [string, ...string[]])
    .optional(),
  approvalNote: z.string().trim().max(1000).optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const authz = await requireAuthz("users.assign");
    const { id } = await ctx.params;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    if (parsed.data.action === "approve" && !parsed.data.assignedRole) {
      return NextResponse.json(
        { error: "Assign a system role when approving." },
        { status: 400 },
      );
    }

    if (parsed.data.assignedRole === "super_administrator") {
      return NextResponse.json(
        { error: "Cannot assign Super Administrator via approval." },
        { status: 403 },
      );
    }

    const supabase = getServiceSupabase();
    if (supabase) {
      const status = parsed.data.action === "approve" ? "approved" : "rejected";
      let assigned_role_id: string | null = null;
      if (parsed.data.assignedRole) {
        const { data: role } = await supabase
          .from("roles")
          .select("id")
          .eq("slug", parsed.data.assignedRole)
          .maybeSingle();
        assigned_role_id = role?.id ?? null;
      }

      const { error } = await supabase
        .from("access_requests")
        .update({
          status,
          assigned_role_id,
          approval_note: parsed.data.approvalNote ?? null,
          reviewed_by: authz.profileId,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        return NextResponse.json({ error: "Update failed." }, { status: 500 });
      }

      await writeAuditEvent({
        actorProfileId: authz.profileId,
        action:
          parsed.data.action === "approve"
            ? "access_request.approved"
            : "access_request.rejected",
        objectType: "access_request",
        objectId: id,
        meta: {
          assignedRole: parsed.data.assignedRole,
          approvalNote: parsed.data.approvalNote,
        },
      });

      return NextResponse.json({ ok: true });
    }

    if (!allowLocalIamFallback()) {
      return NextResponse.json(
        { error: "Identity service is not configured." },
        { status: 503 },
      );
    }

    // Local fallback still requires authenticated session with permission
    // (requireAuthz already ran). Only available outside production.
    const updated = await updateAccessRequest(id, {
      status: parsed.data.action === "approve" ? "approved" : "rejected",
      assignedRole: parsed.data.assignedRole as never,
      reviewedAt: new Date().toISOString(),
      reviewedBy: authz.email,
    });

    if (!updated) {
      return NextResponse.json({ error: "Request not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, request: updated });
  } catch (e) {
    if (e instanceof AuthzError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
}
