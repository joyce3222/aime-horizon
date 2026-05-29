import { NextRequest } from "next/server";
import { cookies } from "next/headers";

function parseUsers(): Record<string, string> {
  const raw = process.env.INTERNAL_USERS || "";
  const users: Record<string, string> = {};
  for (const entry of raw.split(",")) {
    const [name, ...rest] = entry.trim().split(":");
    if (name && rest.length) users[name.trim()] = rest.join(":").trim();
  }
  return users;
}

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const users = parseUsers();

  const expectedPassword = users[username];
  if (!expectedPassword || password !== expectedPassword) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("internal_user", username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  return Response.json({ ok: true, username });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("internal_user");
  return Response.json({ ok: true });
}
