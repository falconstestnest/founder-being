import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthzError, requireAuthz, writeAuditEvent } from "@/lib/iam/authz";
import { allowLocalIamFallback } from "@/lib/iam/constants";
import { SYSTEM_ROLE_SLUGS } from "@/lib/iam/roles";
import { saveInvitation } from "@/lib/iam/store";
import { getServiceSupabase } from "@/lib/supabase/server";

const schema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().transform((e) => e.toLowerCase()),
  roleSlug: z.enum(SYSTEM_ROLE_SLUGS as unknown as [string, ...string[]]),
  departmentSlug: z.string().optional(),
  note: z.string().trim().max(500).optional(),
});

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  try {
    const authz = await requireAuthz("users.assign");

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid invite payload." }, { status: 400 });
    }

    const data = parsed.data;
    if (data.roleSlug === "super_administrator") {
      return NextResponse.json(
        { error: "Super Administrator cannot be invited this way." },
        { status: 403 },
      );
    }
    if (data.roleSlug === "none") {
      return NextResponse.json(
        { error: "Choose a system role that grants operational access." },
        { status: 400 },
      );
    }

    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 72 * 3600 * 1000).toISOString();

    const supabase = getServiceSupabase();
    if (supabase) {
      const { data: role } = await supabase
        .from("roles")
        .select("id")
        .eq("slug", data.roleSlug)
        .maybeSingle();
      if (!role) {
        return NextResponse.json({ error: "Unknown role." }, { status: 400 });
      }

      let departmentId: string | null = null;
      if (data.departmentSlug) {
        const { data: dept } = await supabase
          .from("departments")
          .select("id")
          .eq("slug", data.departmentSlug)
          .maybeSingle();
        departmentId = dept?.id ?? null;
      }

      const { data: inv, error } = await supabase
        .from("invitations")
        .insert({
          email: data.email,
          full_name: data.fullName,
          role_id: role.id,
          department_id: departmentId,
          note: data.note ?? null,
          token_hash: tokenHash,
          status: "pending",
          invited_by: authz.profileId,
          expires_at: expiresAt,
        })
        .select("id")
        .single();

      if (error) {
        console.error("[iam:invite]", error.message);
        return NextResponse.json({ error: "Invite failed." }, { status: 500 });
      }

      await writeAuditEvent({
        actorProfileId: authz.profileId,
        action: "invitation.created",
        objectType: "invitation",
        objectId: inv.id,
        meta: { email: data.email, roleSlug: data.roleSlug },
      });

      // Email delivery: wire Resend/Postmark later. Token only returned once.
      return NextResponse.json({
        ok: true,
        id: inv.id,
        acceptPath: `/access/accept?token=${rawToken}`,
        expiresAt,
      });
    }

    if (!allowLocalIamFallback()) {
      return NextResponse.json(
        { error: "Identity service is not configured." },
        { status: 503 },
      );
    }

    const inv = await saveInvitation({
      email: data.email,
      fullName: data.fullName,
      roleSlug: data.roleSlug as never,
      departmentSlug: data.departmentSlug,
      note: data.note,
      invitedBy: authz.email,
    });

    return NextResponse.json({
      ok: true,
      id: inv.id,
      acceptPath: `/access/accept?token=${inv.token}`,
      expiresAt: inv.expiresAt,
    });
  } catch (e) {
    if (e instanceof AuthzError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
}
