const SESSION_COOKIE = "save_the_date_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const runtimeEnv = typeof process !== "undefined" ? process.env : undefined;
const SESSION_SECRET = runtimeEnv?.ADMIN_SESSION_SECRET ?? "save-the-date-admin-session-change-me";
const ADMIN_USERNAME = runtimeEnv?.ADMIN_USERNAME ?? "savethedate";
const ADMIN_PASSWORD = runtimeEnv?.ADMIN_PASSWORD ?? "savethedate";

const encode = (value: string) => btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const decode = (value: string) => atob(value.replace(/-/g, "+").replace(/_/g, "/"));

async function sign(value: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(SESSION_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return encode(String.fromCharCode(...new Uint8Array(signature)));
}

export async function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = encode(JSON.stringify({ exp: expiresAt }));
  return `${payload}.${await sign(payload)}`;
}

export async function isAdminRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader.split(";").map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1);
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || signature !== await sign(payload)) return false;
  try {
    return JSON.parse(decode(payload)).exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function isAdminCredentials(username: unknown, password: unknown) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function adminSessionCookie(token: string, secure: boolean) {
  return `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; SameSite=Strict${secure ? "; Secure" : ""}`;
}

export function clearAdminSessionCookie(secure: boolean) {
  return `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict${secure ? "; Secure" : ""}`;
}
