import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const user = cookieStore.get("internal_user");
  if (!user?.value) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json({ username: user.value });
}
