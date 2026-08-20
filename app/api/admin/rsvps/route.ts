import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { rsvps } from "@/db/schema";
import { isAdminRequest } from "@/app/lib/admin-auth";

export async function GET(request: Request) {
  if (!await isAdminRequest(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const rows = await getDb().select().from(rsvps).orderBy(desc(rsvps.createdAt));
    return Response.json({ rsvps: rows });
  } catch {
    return Response.json({ error: "Không thể tải danh sách RSVP." }, { status: 500 });
  }
}
