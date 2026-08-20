import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { weddingSettings } from "@/db/schema";
import { isAdminRequest } from "@/app/lib/admin-auth";

function validMusicUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  if (!await isAdminRequest(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const settings = await getDb().select({ musicUrl: weddingSettings.musicUrl }).from(weddingSettings).where(eq(weddingSettings.id, 1)).limit(1);
  return Response.json({ musicUrl: settings[0]?.musicUrl ?? "" });
}

export async function PUT(request: Request) {
  if (!await isAdminRequest(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const payload = await request.json().catch(() => null) as { musicUrl?: unknown } | null;
  const musicUrl = typeof payload?.musicUrl === "string" ? payload.musicUrl.trim().slice(0, 1_000) : "";
  if (!validMusicUrl(musicUrl)) return Response.json({ error: "Link nhạc phải là URL http hoặc https hợp lệ." }, { status: 400 });

  const db = getDb();
  const existing = await db.select({ id: weddingSettings.id }).from(weddingSettings).where(eq(weddingSettings.id, 1)).limit(1);
  if (existing[0]) {
    await db.update(weddingSettings).set({ musicUrl, updatedAt: new Date().toISOString() }).where(eq(weddingSettings.id, 1));
  } else {
    await db.insert(weddingSettings).values({ id: 1, musicUrl });
  }
  return Response.json({ musicUrl });
}
