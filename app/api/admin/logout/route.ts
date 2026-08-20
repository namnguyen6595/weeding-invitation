import { clearAdminSessionCookie } from "@/app/lib/admin-auth";

export async function POST(request: Request) {
  const secure = new URL(request.url).protocol === "https:";
  return Response.json({ authenticated: false }, { headers: { "Set-Cookie": clearAdminSessionCookie(secure) } });
}
