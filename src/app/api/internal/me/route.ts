import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const user = cookieStore.get("internal_user");
  if (!user?.value) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const admin = process.env.INTERNAL_ADMIN || "Joyce";
  return Response.json({ username: user.value, isAdmin: user.value === admin });
}
