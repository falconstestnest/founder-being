import { NextResponse } from "next/server";

type JoinBody = {
  fullName?: string;
  email?: string;
  whatsapp?: string;
  location?: string;
  isFounder?: string;
  company?: string;
  consent?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: JoinBody;

  try {
    body = (await request.json()) as JoinBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fullName = body.fullName?.trim() ?? "";
  const email = body.email?.trim() ?? "";

  if (!fullName || fullName.length < 2) {
    return NextResponse.json(
      { error: "Please enter your full name." },
      { status: 400 },
    );
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  // Persist later via CRM/email provider. Logged for ops visibility in Vercel.
  console.info("[founder-being:join]", {
    fullName,
    email,
    whatsapp: body.whatsapp?.trim() || null,
    location: body.location?.trim() || null,
    isFounder: body.isFounder || null,
    company: body.company?.trim() || null,
    consent: body.consent === "yes",
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
