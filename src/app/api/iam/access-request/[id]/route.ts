import { NextResponse } from "next/server";
import { z } from "zod";
import { isSuperAdminEmail } from "@/lib/iam/constants";
import { ROLE_SLUGS } from "@/lib/iam/roles";
import { updateAccessRequest } from "@/lib/iam/store";
import { getServiceSupabase } from "@/lib/supabase/server";

const schema = z.object({
  action: z.enum(["approve", "reject"]),
  assignedRole: z.enum(ROLE_SLUGS as unknown as [string, ...string[]]).optional(),
  actorEmail: z.string().email().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
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

  if (!isSuperAdminEmail(parsed.data.actorEmail ?? null)) {
    return NextResponse.json(
      { error: "Only Super Administrator can approve access until sessions are enabled." },
      { status: 403 },
    );
  }

  if (parsed.data.action === "approve" && !parsed.data.assignedRole) {
    return NextResponse.json(
      { error: "Assign a role when approving." },
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
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) {
      return NextResponse.json({ error: "Update failed." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  const updated = await updateAccessRequest(id, {
    status: parsed.data.action === "approve" ? "approved" : "rejected",
    assignedRole: parsed.data.assignedRole as never,
    reviewedAt: new Date().toISOString(),
    reviewedBy: parsed.data.actorEmail,
  });

  if (!updated) {
    return NextResponse.json({ error: "Request not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, request: updated });
}
