export const WEDDING_DATE = new Date("2026-09-20T11:00:00+07:00");
export const WEDDING_DATE_END = new Date("2026-09-20T14:00:00+07:00");
export const MUSIC_VIDEO_ID = "hSxQln8dIQQ";
export const PHOTO_URLS = Array.from(
  { length: 36 },
  (_, index) => `https://pub-f56b79df70fa43399d2d0de06b99b7bf.r2.dev/anh-cuoi/photo-${String(index + 1).padStart(3, "0")}.webp`,
);
export const SEPTEMBER_DAYS = [...Array(2).fill(null), ...Array.from({ length: 30 }, (_, index) => index + 1)];

export type GuestSide = "groom" | "bride";
export type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

export type GuestSideConfig = {
  label: string;
  shortLabel: string;
  venueLabel: string;
  venueName: string;
  address: string;
  mapUrl: string;
};

export const GUEST_SIDES = {
  groom: {
    label: "Khách nhà trai",
    shortLabel: "Nhà trai",
    venueLabel: "Tiệc cưới nhà trai",
    venueName: "Tràng An Palace",
    address: "Số 1 Ngụy Như Kon Tum, Thanh Xuân, Hà Nội",
    mapUrl: "https://maps.app.goo.gl/JVmSvqrLpJtKxhTq9",
  },
  bride: {
    label: "Khách nhà gái",
    shortLabel: "Nhà gái",
    venueLabel: "Tiệc cưới nhà gái",
    venueName: "",
    address: "Số nhà 1, Ngách 3 ,Ngõ 6, Bất Bạt, Hà Nội",
    mapUrl: "https://maps.app.goo.gl/kkA1NH6pYd4HkiN98",
  },
} satisfies Record<GuestSide, GuestSideConfig>;

export const VENUE_PLACEHOLDERS: Record<GuestSide, { name: string; address: string }> = {
  groom: { name: "Tràng An Palace", address: "Số 1 Ngụy Như Kon Tum, Thanh Xuân, Hà Nội" },
  bride: { name: "Tư gia nhà gái", address: "Số nhà 1, Ngách 3 ,Ngõ 6, Bất Bạt, Hà Nội" },
};

export const calculateTimeLeft = (): TimeLeft => {
  const remaining = Math.max(0, WEDDING_DATE.getTime() - Date.now());
  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60),
  };
};

export const downloadCalendarInvite = () => {
  const toIcsDate = (date: Date) => {
    const pad = (value: number) => String(value).padStart(2, "0");
    return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
  };
  const escapeIcsText = (value: string) => value.replace(/([,;])/g, "\\$1");
  const icsContent = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Nam & Mai Wedding//VI", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
    `UID:nam-mai-wedding-${WEDDING_DATE.getTime()}@save-the-date-nam-mai.dewna.it.com`, `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(WEDDING_DATE)}`, `DTEND:${toIcsDate(WEDDING_DATE_END)}`,
    `SUMMARY:${escapeIcsText("Lễ thành hôn Nguyễn Thành Nam & Ngô Tuyết Mai")}`,
    `DESCRIPTION:${escapeIcsText("Trân trọng kính mời bạn đến chung vui trong lễ thành hôn của Nguyễn Thành Nam và Ngô Tuyết Mai.")}`,
    `LOCATION:${escapeIcsText("Thông tin địa điểm sẽ được cập nhật")}`, "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "nam-mai-wedding.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
