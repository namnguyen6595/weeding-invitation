import { adminSessionCookie, createAdminSession, isAdminCredentials } from "@/app/lib/admin-auth";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as { username?: string; password?: string } | null;
  if (!isAdminCredentials(payload?.username, payload?.password)) {
    return Response.json({ error: "Tên đăng nhập hoặc mật khẩu không đúng." }, { status: 401 });
  }

  const token = await createAdminSession();
  const secure = new URL(request.url).protocol === "https:";
  return Response.json({ authenticated: true }, { headers: { "Set-Cookie": adminSessionCookie(token, secure) } });
}
