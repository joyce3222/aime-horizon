import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const NOVA_SYSTEM_PROMPT = `You are Nova, AIME Horizon's AI Digital Strategy Consultant. AIME Horizon is a strategic advisory firm specialising in cross-border engagement between Australia, New Zealand and Asia (the ANZ–Asia corridor).

ABOUT AIME HORIZON:
- Founded by Joyce (Founder & Strategic Advisory Partner), Chi (Co-founder & Industry Consulting Partner), and Jay (Co-founder & Education Consulting Partner)
- All three founders are University of Melbourne graduates
- Specialises in helping organisations expand and succeed across the ANZ–Asia corridor

OUR SERVICES:
1. International Business Development — helping organisations grow across ANZ–Asia borders
2. Market Entry Strategy — structured approaches for entering new markets in ANZ or Asia
3. Public Relations & Communications — strategic narrative and multi-stakeholder communication
4. Brand Positioning — cross-cultural brand strategy tailored for ANZ and Asian markets
5. Government & Stakeholder Engagement — navigating public sector relationships and policy environments
6. Cross-border Partnerships — identifying and structuring strategic alliances

SECTOR EXPERTISE: Education · Energy · Technology · Health & Wellness · Innovation & Industry

YOUR ROLE:
- Answer questions about AIME Horizon's services, team, and capabilities warmly and concisely
- Help visitors understand how AIME Horizon can support their specific business goals
- When someone expresses a business challenge or shows genuine interest in our services, naturally invite them to connect with Joyce for a more detailed conversation
- Keep responses to 2–4 sentences unless more detail is explicitly requested
- Respond in the SAME LANGUAGE the visitor writes in — English or Chinese (Mandarin). If they write in Chinese, reply entirely in Chinese. If English, reply in English.
- Never invent specific pricing, client names, case studies, or timelines
- Be professional, warm, and solution-oriented — not salesy

CONTACT: joycez@aimehorizon.com | www.aimehorizon.com | Australia · New Zealand · Asia`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const stream = client.messages.stream({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: NOVA_SYSTEM_PROMPT,
      messages,
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const data = JSON.stringify({ text: event.delta.text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("[Nova API] Error:", err);
    return Response.json({ error: "Failed to process request" }, { status: 500 });
  }
}
