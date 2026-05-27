import { NextRequest } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, organisation, interest, message } = body;

    if (!name || !email) {
      return Response.json({ error: "Name and email are required" }, { status: 400 });
    }

    const timestamp = new Date().toLocaleString("en-AU", {
      timeZone: "Australia/Melbourne",
      dateStyle: "full",
      timeStyle: "short",
    });

    // ── Log the lead (always, as a fallback record) ──────────────────────
    console.log("[Nova Lead]", { name, email, organisation, interest, message, timestamp });

    // ── Send email notification via Resend (if API key configured) ────────
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "Nova <onboarding@resend.dev>", // update to noreply@aimehorizon.com after domain verification
        to: ["joycez@aimehorizon.com"],
        subject: `✨ New lead from Nova: ${name}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #fff; color: #0B1F3A;">
            <div style="border-bottom: 2px solid #C5965A; padding-bottom: 16px; margin-bottom: 24px;">
              <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #C5965A; margin: 0 0 8px;">AIME Horizon · Nova AI</p>
              <h1 style="font-size: 22px; font-weight: 400; margin: 0;">New Enquiry Captured</h1>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ede7; color: #888; width: 140px; font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase;">Name</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ede7; font-weight: 500;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ede7; color: #888; font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ede7;"><a href="mailto:${email}" style="color: #C5965A;">${email}</a></td>
              </tr>
              ${organisation ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ede7; color: #888; font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase;">Organisation</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ede7;">${organisation}</td>
              </tr>` : ""}
              ${interest ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ede7; color: #888; font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase;">Interest</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ede7;">${interest}</td>
              </tr>` : ""}
              <tr>
                <td style="padding: 10px 0; color: #888; font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase;">Time (AEST)</td>
                <td style="padding: 10px 0;">${timestamp}</td>
              </tr>
            </table>

            ${message ? `
            <div style="background: #F5F0E8; border-left: 3px solid #C5965A; padding: 16px 20px; margin-bottom: 24px; border-radius: 0 4px 4px 0;">
              <p style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #C5965A; margin: 0 0 8px;">Message from visitor</p>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #0B1F3A;">${message}</p>
            </div>` : ""}

            <a href="mailto:${email}?subject=Re: AIME Horizon Enquiry"
               style="display: inline-block; background: #C5965A; color: #fff; text-decoration: none; padding: 12px 28px; font-size: 13px; letter-spacing: 0.05em; border-radius: 2px;">
              Reply to ${name} →
            </a>

            <p style="margin-top: 32px; font-size: 11px; color: #bbb;">Captured via Nova · AIME Horizon AI Digital Assistant · aimehorizon.com</p>
          </div>
        `,
      });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("[Nova Lead] Error:", err);
    return Response.json({ error: "Failed to save lead" }, { status: 500 });
  }
}
