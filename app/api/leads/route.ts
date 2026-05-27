import { leadCaptureSchema } from "@/lib/validation";
import { enforceRateLimit, isHoneypotFilled } from "@/lib/abuse";
import { getResendClient } from "@/lib/resend";
import { env } from "@/lib/env";
import { saveLeadRecord } from "@/lib/store";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = leadCaptureSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json({ error: "Invalid lead payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  if (isHoneypotFilled(parsed.data.honeypot)) {
    return Response.json({ error: "Spam detected" }, { status: 400 });
  }

  const rateCheck = enforceRateLimit(clientKey(request));
  if (!rateCheck.allowed) {
    return Response.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  const record = await saveLeadRecord({
    auditId: parsed.data.auditId,
    email: parsed.data.email,
    company: parsed.data.company,
    role: parsed.data.role,
    teamSize: parsed.data.teamSize,
    createdAt: new Date().toISOString()
  });

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      await supabase.from("lead_captures").insert(record);
    } catch (error) {
      console.error("Failed to persist lead record", error);
    }
  }

  const resend = getResendClient();
  if (resend && env.RESEND_FROM_EMAIL) {
    try {
      await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: parsed.data.email,
        subject: "Your Credex AI spend audit is ready",
        html: `<p>Thanks for requesting a follow-up on your Credex audit. We reviewed your stack and captured the lead successfully.</p>`
      });
    } catch (error) {
      console.error("Failed to send lead confirmation email", error);
    }
  }

  return Response.json({ ok: true });
}
