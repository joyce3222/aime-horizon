import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
    }

    console.log("[Newsletter] New subscriber:", email);

    if (process.env.RESEND_API_KEY) {
      // Notify Joyce
      await resend.emails.send({
        from: "AIME Horizon <onboarding@resend.dev>",
        to: ["joycez@aimehorizon.com"],
        subject: `📬 New newsletter subscriber: ${email}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:32px;color:#0B1F3A;">
            <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C5965A;margin:0 0 16px;">AIME Horizon · Newsletter</p>
            <h2 style="font-size:20px;font-weight:400;margin:0 0 16px;">New Subscriber</h2>
            <p style="font-size:14px;margin:0 0 8px;">Email: <strong>${email}</strong></p>
            <p style="font-size:12px;color:#888;margin:24px 0 0;">Add to your Australia–China Business Insights list.</p>
          </div>`,
      });

      // Welcome email to subscriber
      await resend.emails.send({
        from: "Joyce · AIME Horizon <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to AIME Horizon's Australia–China Business Insights",
        html: `
          <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;background:#fff;">
            <div style="background:#0B1F3A;padding:32px 36px 28px;">
              <p style="font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#C5965A;margin:0 0 10px;">AIME Horizon</p>
              <h1 style="font-size:22px;font-weight:400;color:#fff;margin:0;">You're subscribed.</h1>
              <div style="margin-top:16px;width:32px;height:2px;background:#C5965A;"></div>
            </div>
            <div style="padding:32px 36px;">
              <p style="font-size:14px;color:#2d2d2d;line-height:1.7;margin:0 0 16px;">
                Thank you for subscribing to <strong>Australia–China Business Insights</strong> — AIME Horizon's monthly intelligence brief on bilateral trade, policy, and market opportunities across the ANZ–Asia corridor.
              </p>
              <p style="font-size:14px;color:#2d2d2d;line-height:1.7;margin:0 0 24px;">
                You'll receive your first edition at the start of next month. In the meantime, feel free to reach out if you have any questions about cross-border opportunities.
              </p>
              <p style="font-size:14px;color:#2d2d2d;margin:0;">
                Warm regards,<br/>
                <strong>Joyce</strong><br/>
                <span style="color:#888;font-size:12px;">Founder · AIME Horizon</span>
              </p>
            </div>
            <div style="background:#F5F0E8;padding:16px 36px;border-top:1px solid #e8e3d9;">
              <p style="font-size:11px;color:#aaa;margin:0;">
                <a href="https://www.aimehorizon.com" style="color:#C5965A;text-decoration:none;">aimehorizon.com</a> · Australia · New Zealand · Asia
              </p>
            </div>
          </div>`,
      });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("[Newsletter Subscribe] Error:", err);
    return Response.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
