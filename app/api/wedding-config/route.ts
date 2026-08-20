import { getDb } from "@/db";
import { weddingConfigs } from "@/db/schema";
import { GUEST_SIDES, withEventDate, type GuestSide } from "@/app/components/wedding/constants";

const CONFIG_CACHE_CONTROL = "public, max-age=0, s-maxage=30, stale-while-revalidate=30";
const CONFIG_CACHE_TAG = "wedding-config";

export async function GET() {
  try {
    const rows = await getDb().select().from(weddingConfigs);
    const configs: Partial<Record<GuestSide, (typeof GUEST_SIDES)[GuestSide]>> = {};
    for (const row of rows) {
      const side = row.family as GuestSide;
      if (side in GUEST_SIDES) {
        configs[side] = withEventDate({ ...GUEST_SIDES[side], venueName: row.venueName, address: row.address, mapUrl: row.mapUrl, musicUrl: row.musicUrl, coverImageUrl: row.coverImageUrl, familiesGroomImageUrl: row.familiesGroomImageUrl, familiesBrideImageUrl: row.familiesBrideImageUrl, storyImageUrl: row.storyImageUrl, timelineImageUrl: row.timelineImageUrl }, row.eventDate);
      }
    }
    return Response.json({ configs }, { headers: { "Cache-Control": CONFIG_CACHE_CONTROL, "Cache-Tag": CONFIG_CACHE_TAG } });
  } catch {
    return Response.json({ error: "Unable to load wedding config" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
