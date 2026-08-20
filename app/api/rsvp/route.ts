import { getDb } from "@/db";
import { rsvps } from "@/db/schema";

function isAttendance(value: unknown): value is "yes" | "no" {
  return value === "yes" || value === "no";
}

function isFamily(value: unknown): value is "groom" | "bride" {
  return value === "groom" || value === "bride";
}

function toRouteErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  const detail =
    error instanceof Error && error.cause instanceof Error ? error.cause.message : "";
  const combined = `${message}\n${detail}`;

  if (combined.includes("no such table") || combined.includes('from "rsvps"')) {
    return "Bảng rsvps chưa sẵn sàng trên D1. Chạy `npm run db:generate` để tạo migration, rồi áp dụng bằng `wrangler d1 execute` (xem README) trước khi dùng form thật.";
  }

  return message;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      guestName?: string;
      attendance?: string;
      guests?: string | number;
      family?: string;
      message?: string;
    };

    const guestName = payload.guestName?.trim().slice(0, 200) ?? "";
    const message = payload.message?.trim().slice(0, 1000) ?? "";
    const guestCount = Math.min(Math.max(Math.trunc(Number(payload.guests)) || 1, 1), 4);

    if (!guestName) {
      return Response.json({ error: "Vui lòng nhập họ và tên." }, { status: 400 });
    }
    if (!isAttendance(payload.attendance)) {
      return Response.json({ error: "Vui lòng chọn phản hồi tham dự." }, { status: 400 });
    }
    const attendance = payload.attendance;
    if (!isFamily(payload.family)) {
      return Response.json({ error: "Vui lòng chọn nhà trai hoặc nhà gái." }, { status: 400 });
    }
    const family = payload.family;

    const db = getDb();
    const [rsvp] = await db
      .insert(rsvps)
      .values({
        guestName,
        attendance,
        guestCount,
        family,
        message,
      })
      .returning();

    return Response.json({ rsvp }, { status: 201 });
  } catch (error) {
    return Response.json({ error: toRouteErrorMessage(error) }, { status: 500 });
  }
}
