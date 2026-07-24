import { NextResponse } from "next/server";
import { z } from "zod";
import { isSuperAdminEmail } from "@/lib/iam/constants";
import { ROLE_SLUGS } from "@/lib/iam/roles";
import { saveInvitation } from "@/lib/iam/store";
import { getServiceSupabase } from "@/lib/supabase/server";

const schema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().transform((e) => e.toLowerCase()),
  roleSlug: z.enum(ROLE_SLUGS as unknown as [string, ...string[]]),
  departmentSlug: z.string().optional(),
  note: z.string().trim().max(500).optional(),
  /** Temporary: client asserts actor email until Supabase Auth session is wired. */
  actorEmail: z.string().email().optional(),
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
    return NextResponse.json({ error: "Invalid invite payload." }, { status: 400 });
  }

  const data = parsed.data;
  if (data.roleSlug === "super_administrator") {
    return NextResponse.json(
      { error: "Super Administrator cannot be invited this way." },
      { status: 403 },
    );
  }

  // Until session auth exists, only allow invite when actor is Super Admin email.
  if (!isSuperAdminEmail(data.actorEmail ?? null)) {
    return NextResponse.json(
      { error: "Only Super Administrator can invite until auth sessions are enabled." },
      { status: 403 },
    );
  }

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
    const token = crypto.randomUUID().replace(/-/g, "");
    const expires = new Date(Date.now() + 7 * 864e5).toISOString();
    const { data: inv, error } = await supabase
      .from("invitations")
      .insert({
        email: data.email,
        full_name: data.fullName,
        role_id: role.id,
        note: data.note ?? null,
        token,
        status: "pending",
        expires_at: expires,
      })
      .select("id, token")
      .single();
    if (error) {
      console.error("[iam:invite]", error.message);
      return NextResponse.json({ error: "Invite failed." }, { status: 500 });
    }
    return NextResponse.json({
      ok: true,
      id: inv.id,
      acceptPath: `/access/accept?token=${inv.token}`,
    });
  }

  const inv = await saveInvitation({
    email: data.email,
    fullName: data.fullName,
    roleSlug: data.roleSlug as never,
    departmentSlug: data.departmentSlug,
    note: data.note,
    invitedBy: data.actorEmail ?? "super-admin",
  });

  return NextResponse.json({
    ok: true,
    id: inv.id,
    acceptPath: `/access/accept?token=${inv.token}`,
  });
}
