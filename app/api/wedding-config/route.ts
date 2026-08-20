import { getDb } from "@/db";
import { weddingConfigs } from "@/db/schema";
import { GUEST_SIDES, withEventDate, type GuestSide } from "@/app/components/wedding/constants";

export async function GET() {
  try {
    const rows = await getDb().select().from(weddingConfigs);
    const configs = { ...GUEST_SIDES };
    for (const row of rows) {
      const side = row.family as GuestSide;
      if (side in configs) configs[side] = withEventDate({ ...configs[side], venueName: row.venueName, address: row.address, mapUrl: row.mapUrl }, row.eventDate);
    }
    return Response.json({ configs }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ configs: GUEST_SIDES }, { headers: { "Cache-Control": "no-store" } });
  }
}
