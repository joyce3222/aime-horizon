import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const user = cookieStore.get("internal_user");
  if (!user?.value) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { transcript, title } = await req.json();
  if (!transcript?.trim()) {
    return Response.json({ error: "No transcript provided" }, { status: 400 });
  }

  const prompt = `You are a professional meeting secretary for AIME Horizon, an Australia-based strategic advisory firm specialising in cross-border engagement between Australia, New Zealand, China, and Asia.

Analyse the following meeting transcript and produce structured meeting minutes in the SAME LANGUAGE as the transcript (Chinese or English).

Meeting title: ${title || "Untitled Meeting"}

Transcript:
${transcript}

Produce the minutes in this exact JSON format:
{
  "summary": "2-3 paragraph executive summary of the meeting",
  "decisions": ["decision 1", "decision 2", ...],
  "actions": [{"task": "task description", "owner": "person name or TBD", "due": "due date or TBD"}, ...],
  "nextSteps": "Brief paragraph on next steps"
}

Be concise, professional, and accurate. Only include what was actually discussed. If a field has no relevant content, use an empty array or empty string.`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ error: "Failed to parse minutes" }, { status: 500 });
    }

    const minutes = JSON.parse(jsonMatch[0]);
    return Response.json({ minutes });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to generate minutes" }, { status: 500 });
  }
}
