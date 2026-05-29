import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

async function getUsername(): Promise<string | null> {
  const cookieStore = await cookies();
  const user = cookieStore.get("internal_user");
  return user?.value || null;
}

export async function GET() {
  const username = await getUsername();
  if (!username) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const data = await redis.get(`conversations:${username}`);
  return Response.json({ conversations: data || {} });
}

export async function POST(req: NextRequest) {
  const username = await getUsername();
  if (!username) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { conversations } = await req.json();
  // Keep max 50 messages per advisor to avoid hitting storage limits
  const trimmed: Record<string, unknown[]> = {};
  for (const [advisorId, msgs] of Object.entries(conversations)) {
    trimmed[advisorId] = (msgs as unknown[]).slice(-50);
  }

  await redis.set(`conversations:${username}`, trimmed);
  return Response.json({ ok: true });
}
