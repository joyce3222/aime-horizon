import { cookies } from "next/headers";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const user = cookieStore.get("internal_user")?.value;
  const admin = process.env.INTERNAL_ADMIN || "Joyce";
  return user === admin;
}

function parseUsers(): string[] {
  const raw = process.env.INTERNAL_USERS || "";
  return raw.split(",").map((e) => e.split(":")[0].trim()).filter(Boolean);
}

export async function GET() {
  if (!(await isAdmin())) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = parseUsers();
  const result: Record<string, Record<string, unknown[]>> = {};

  await Promise.all(
    users.map(async (username) => {
      const data = await redis.get(`conversations:${username}`);
      result[username] = (data as Record<string, unknown[]>) || {};
    })
  );

  return Response.json({ users: result });
}
