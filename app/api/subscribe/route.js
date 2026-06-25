import { NextResponse } from "next/server";
import { getSiteUrl } from "../../../lib/site-url";

export async function POST(req) {
  let email;
  try {
    ({ email } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const res = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      includeListIds: [5],
      templateId: 2,
      redirectionUrl: getSiteUrl(),
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    console.error("Brevo subscribe error:", res.status, body);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
