import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { weddingConfigs } from "@/db/schema";
import { GUEST_SIDES, PHOTO_URLS, withEventDate, type GuestSide } from "@/app/components/wedding/constants";
import { isAdminRequest } from "@/app/lib/admin-auth";

function isSide(value: unknown): value is GuestSide { return value === "groom" || value === "bride"; }

function validMapUrl(value: string) {
  if (!value) return true;
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:"; } catch { return false; }
}

function validGalleryImageUrl(value: string) {
  return !value || PHOTO_URLS.includes(value);
}

function validatePayload(payload: unknown) {
  const value = payload as Partial<Record<"family" | "venueName" | "address" | "mapUrl" | "musicUrl" | "coverImageUrl" | "familiesGroomImageUrl" | "familiesBrideImageUrl" | "storyImageUrl" | "timelineImageUrl" | "eventDate", unknown>>;
  if (!isSide(value.family) || typeof value.venueName !== "string" || typeof value.address !== "string" || typeof value.mapUrl !== "string" || typeof value.musicUrl !== "string" || typeof value.coverImageUrl !== "string" || typeof value.familiesGroomImageUrl !== "string" || typeof value.familiesBrideImageUrl !== "string" || typeof value.storyImageUrl !== "string" || typeof value.timelineImageUrl !== "string" || typeof value.eventDate !== "string") return null;
  if (!value.eventDate || Number.isNaN(new Date(value.eventDate).getTime()) || !validMapUrl(value.mapUrl) || !validMapUrl(value.musicUrl) || !validGalleryImageUrl(value.coverImageUrl) || !validGalleryImageUrl(value.familiesGroomImageUrl) || !validGalleryImageUrl(value.familiesBrideImageUrl) || !validGalleryImageUrl(value.storyImageUrl) || !validGalleryImageUrl(value.timelineImageUrl)) return null;
  return { family: value.family, venueName: value.venueName.trim().slice(0, 200), address: value.address.trim().slice(0, 500), mapUrl: value.mapUrl.trim().slice(0, 500), musicUrl: value.musicUrl.trim().slice(0, 1000), coverImageUrl: value.coverImageUrl.trim().slice(0, 1000), familiesGroomImageUrl: value.familiesGroomImageUrl.trim().slice(0, 1000), familiesBrideImageUrl: value.familiesBrideImageUrl.trim().slice(0, 1000), storyImageUrl: value.storyImageUrl.trim().slice(0, 1000), timelineImageUrl: value.timelineImageUrl.trim().slice(0, 1000), eventDate: value.eventDate };
}

export async function GET(request: Request) {
  if (!await isAdminRequest(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await getDb().select().from(weddingConfigs);
  const configs = { ...GUEST_SIDES };
  for (const row of rows) { const side = row.family as GuestSide; if (side in configs) configs[side] = withEventDate({ ...configs[side], venueName: row.venueName, address: row.address, mapUrl: row.mapUrl, musicUrl: row.musicUrl, coverImageUrl: row.coverImageUrl, familiesGroomImageUrl: row.familiesGroomImageUrl, familiesBrideImageUrl: row.familiesBrideImageUrl, storyImageUrl: row.storyImageUrl, timelineImageUrl: row.timelineImageUrl }, row.eventDate); }
  return Response.json({ configs });
}

export async function PUT(request: Request) {
  if (!await isAdminRequest(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const payload = validatePayload(await request.json().catch(() => null));
  if (!payload) return Response.json({ error: "Thông tin cấu hình không hợp lệ." }, { status: 400 });
  const db = getDb();
  const existing = await db.select({ id: weddingConfigs.id }).from(weddingConfigs).where(eq(weddingConfigs.family, payload.family)).limit(1);
  if (existing[0]) await db.update(weddingConfigs).set({ venueName: payload.venueName, address: payload.address, mapUrl: payload.mapUrl, musicUrl: payload.musicUrl, coverImageUrl: payload.coverImageUrl, familiesGroomImageUrl: payload.familiesGroomImageUrl, familiesBrideImageUrl: payload.familiesBrideImageUrl, storyImageUrl: payload.storyImageUrl, timelineImageUrl: payload.timelineImageUrl, eventDate: payload.eventDate, updatedAt: new Date().toISOString() }).where(eq(weddingConfigs.family, payload.family));
  else await db.insert(weddingConfigs).values(payload);
  const config = withEventDate({ ...GUEST_SIDES[payload.family], venueName: payload.venueName, address: payload.address, mapUrl: payload.mapUrl, musicUrl: payload.musicUrl, coverImageUrl: payload.coverImageUrl, familiesGroomImageUrl: payload.familiesGroomImageUrl, familiesBrideImageUrl: payload.familiesBrideImageUrl, storyImageUrl: payload.storyImageUrl, timelineImageUrl: payload.timelineImageUrl }, payload.eventDate);
  return Response.json({ config });
}
