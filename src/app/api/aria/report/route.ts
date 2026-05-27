import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import { NextRequest } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Date helpers ─────────────────────────────────────────────────────────────

function getWeekRange(): { display: string; iso: string } {
  const now = new Date(
    new Date().toLocaleString("en-AU", { timeZone: "Australia/Melbourne" })
  );
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

  return {
    display: `${fmt(monday)} – ${fmt(friday)}`,
    iso: now.toISOString().split("T")[0],
  };
}

// ─── Report prompt ────────────────────────────────────────────────────────────

function buildPrompt(weekRange: string, isoDate: string): string {
  return `You are Aria, AIME Horizon's AI Market Intelligence Analyst. Today is ${isoDate}. Generate a professional **Weekly Strategic Intelligence Brief** for AIME Horizon's advisory team covering the week of ${weekRange}.

AIME Horizon is a cross-border strategic advisory firm focused on the ANZ–Asia corridor (Australia, New Zealand ↔ Asia). Our clients are organisations navigating market entry, business development, government engagement, and brand positioning across these regions. Our sector expertise: Education · Energy · Technology · Health & Wellness · Innovation & Industry.

---

REPORT FORMAT (use these exact section headings):

## Executive Summary
Three concise bullet points capturing the most critical strategic developments this week for ANZ–Asia businesses.

## Macro & Geopolitical Environment
Key trade, investment, diplomatic, or policy dynamics shaping the ANZ–Asia corridor. Include Australia/NZ relationships with China, ASEAN, and other key Asian partners.

## Sector Intelligence

**Education:** International student flows, institutional partnerships, policy changes, pathway opportunities across ANZ and Asia.

**Energy & Resources:** Renewable transition, critical minerals, energy security, ANZ-Asia supply chains.

**Technology & Digital Economy:** AI adoption, digital trade, platform regulation, cross-border tech partnerships.

**Health & Wellness:** Medical tourism, biotech, regulatory convergence, health policy developments.

**Innovation & Industry:** Manufacturing, supply chain resilience, IP considerations, emerging industries.

## Strategic Opportunities
Two or three specific, actionable opportunities for organisations operating in the ANZ–Asia corridor right now.

## Risks & Tensions
Two or three key risks or geopolitical/regulatory tensions that ANZ–Asia businesses should be monitoring.

## This Week's Advisory Focus
One paragraph of direct, practical guidance for AIME Horizon clients — what should they be prioritising or watching this week?

---

TONE: Authoritative, analytical, specific. Write for senior business advisors and executives, not for general audiences. Avoid generic filler — every sentence should carry strategic weight. Be direct and opinionated where appropriate.`;
}

// ─── Email template ───────────────────────────────────────────────────────────

function buildEmail(reportMarkdown: string, weekRange: string, isoDate: string): string {
  // Convert markdown to simple HTML
  const html = reportMarkdown
    .replace(/^## (.+)$/gm, '<h2 style="font-family:Georgia,serif;font-size:17px;font-weight:400;color:#0B1F3A;margin:28px 0 10px;padding-bottom:6px;border-bottom:1px solid #e8e3d9;">$1</h2>')
    .replace(/^\*\*(.+?)\*\*$/gm, '<p style="font-family:Georgia,serif;font-size:14px;font-weight:600;color:#0B1F3A;margin:14px 0 4px;">$1</p>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^• (.+)$/gm, '<li style="margin-bottom:6px;">$1</li>')
    .replace(/^- (.+)$/gm, '<li style="margin-bottom:6px;">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, (match) => `<ul style="padding-left:20px;margin:8px 0;">${match}</ul>`)
    .replace(/\n\n/g, '</p><p style="font-family:Georgia,serif;font-size:14px;color:#2d2d2d;line-height:1.75;margin:0 0 12px;">')
    .replace(/\n/g, '<br/>');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:Georgia,serif;">
  <div style="max-width:620px;margin:32px auto;background:#ffffff;border-radius:2px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#0B1F3A;padding:32px 36px 28px;">
      <p style="font-family:Georgia,serif;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#C5965A;margin:0 0 10px;">AIME Horizon · Aria AI</p>
      <h1 style="font-family:Georgia,serif;font-size:24px;font-weight:400;color:#ffffff;margin:0 0 8px;line-height:1.3;">Weekly Intelligence Brief</h1>
      <p style="font-family:sans-serif;font-size:12px;color:rgba(255,255,255,0.45);margin:0;letter-spacing:0.03em;">${weekRange}</p>
      <div style="margin-top:20px;width:40px;height:2px;background:#C5965A;"></div>
    </div>

    <!-- Report body -->
    <div style="padding:32px 36px 28px;">
      <p style="font-family:Georgia,serif;font-size:14px;color:#2d2d2d;line-height:1.75;margin:0 0 12px;">
        ${html}
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#F5F0E8;padding:20px 36px;border-top:1px solid #e8e3d9;">
      <table style="width:100%;">
        <tr>
          <td style="font-family:sans-serif;font-size:11px;color:#aaa;letter-spacing:0.03em;">
            Generated by Aria · AIME Horizon AI Market Intelligence<br/>
            <a href="https://www.aimehorizon.com" style="color:#C5965A;text-decoration:none;">aimehorizon.com</a> · Australia · New Zealand · Asia
          </td>
          <td style="text-align:right;">
            <span style="font-family:Georgia,serif;font-size:13px;color:#C5965A;letter-spacing:0.1em;">ANZ ↔ ASIA</span>
          </td>
        </tr>
      </table>
    </div>

  </div>
  <p style="text-align:center;font-family:sans-serif;font-size:10px;color:#bbb;margin:16px 0 32px;">
    Report date: ${isoDate} · AIME Horizon confidential
  </p>
</body>
</html>`;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // Verify this is a legitimate Vercel cron call OR a manual trigger with the cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { display: weekRange, iso: isoDate } = getWeekRange();
    const prompt = buildPrompt(weekRange, isoDate);

    console.log(`[Aria] Generating weekly report for ${weekRange}…`);

    // Generate report with Claude
    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const reportText =
      message.content[0].type === "text" ? message.content[0].text : "";

    if (!reportText) {
      throw new Error("Empty report from Claude");
    }

    console.log(`[Aria] Report generated (${reportText.length} chars). Sending email…`);

    // Send via Resend
    const emailResult = await resend.emails.send({
      from: "Aria <onboarding@resend.dev>", // update to aria@aimehorizon.com after domain verification
      to: ["joycez@aimehorizon.com"],
      subject: `📊 Aria Weekly Brief · ${weekRange}`,
      html: buildEmail(reportText, weekRange, isoDate),
    });

    console.log("[Aria] Email sent:", emailResult);

    return Response.json({
      success: true,
      week: weekRange,
      reportLength: reportText.length,
      emailId: emailResult.data?.id,
    });
  } catch (err) {
    console.error("[Aria] Error:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

// Support POST too (for manual triggers via fetch)
export const POST = GET;
