import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { weddingConfigs, weddingSettings } from "@/db/schema";
import { GUEST_SIDES, withEventDate, type GuestSide } from "@/app/components/wedding/constants";

export async function GET() {
  try {
    const db = getDb();
    const [rows, settings] = await Promise.all([
      db.select().from(weddingConfigs),
      db.select({ musicUrl: weddingSettings.musicUrl }).from(weddingSettings).where(eq(weddingSettings.id, 1)).limit(1),
    ]);
    const configs: Partial<Record<GuestSide, (typeof GUEST_SIDES)[GuestSide]>> = {};
    for (const row of rows) {
      const side = row.family as GuestSide;
      if (side in GUEST_SIDES) {
        configs[side] = withEventDate({ ...GUEST_SIDES[side], venueName: row.venueName, address: row.address, mapUrl: row.mapUrl }, row.eventDate);
      }
    }
    return Response.json({ configs, musicUrl: settings[0]?.musicUrl ?? "" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Unable to load wedding config" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
