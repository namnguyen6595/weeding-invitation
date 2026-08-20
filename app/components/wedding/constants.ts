export const DEFAULT_EVENT_DATE = "2026-09-20T11:00:00+07:00";
export const MUSIC_VIDEO_ID = "hSxQln8dIQQ";
export const PHOTO_URLS = Array.from(
  { length: 36 },
  (_, index) =>
    `https://pub-f56b79df70fa43399d2d0de06b99b7bf.r2.dev/anh-cuoi/photo-${String(index + 1).padStart(3, "0")}.webp`,
);
export const SEPTEMBER_DAYS = [
  ...Array(2).fill(null),
  ...Array.from({ length: 30 }, (_, index) => index + 1),
];

export type GuestSide = "groom" | "bride";
export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};
export type GuestSideDate = {
  iso: string;
  display: string;
  time: string;
  day: number;
  month: string;
  year: number;
  lunar: string;
};

export type GuestSideConfig = {
  label: string;
  shortLabel: string;
  venueLabel: string;
  venueName: string;
  address: string;
  mapUrl: string;
  date: GuestSideDate;
};

export function withEventDate(config: GuestSideConfig, iso: string): GuestSideConfig {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date(iso)).reduce<Record<string, string>>((result, part) => {
    result[part.type] = part.value;
    return result;
  }, {});
  const day = Number(parts.day);
  const month = Number(parts.month);
  const year = Number(parts.year);
  const time = `${parts.hour}:${parts.minute}`;
  return { ...config, date: { ...config.date, iso, display: `${time} · ${String(day).padStart(2, "0")} · ${String(month).padStart(2, "0")} · ${year}`, time, day, month: `Tháng ${String(month).padStart(2, "0")}`, year } };
}

export const GUEST_SIDES = {
  groom: {
    label: "Khách nhà trai",
    shortLabel: "Nhà trai",
    venueLabel: "Tiệc cưới nhà trai",
    venueName: "Tràng An Palace",
    address: "Số 1 Ngụy Như Kon Tum, Thanh Xuân, Hà Nội",
    mapUrl: "https://maps.app.goo.gl/JVmSvqrLpJtKxhTq9",
    date: {
      iso: "2026-09-20T11:00:00+07:00",
      display: "11:00 · 20 · 09 · 2026",
      time: "11:00",
      day: 20,
      month: "Tháng 09",
      year: 2026,
      lunar: "Tức ngày 10 tháng 08 năm Bính Ngọ",
    },
  },
  bride: {
    label: "Khách nhà gái",
    shortLabel: "Nhà gái",
    venueLabel: "Tiệc cưới nhà gái",
    venueName: "",
    address: "Số nhà 1, Ngách 3 ,Ngõ 6, Bất Bạt, Hà Nội",
    mapUrl: "https://maps.app.goo.gl/kkA1NH6pYd4HkiN98",
    date: {
      iso: "2026-09-19T15:00:00+07:00",
      display: "15:00 · 19 · 09 · 2026",
      time: "15:00",
      day: 19,
      month: "Tháng 09",
      year: 2026,
      lunar: "Tức ngày 09 tháng 08 năm Bính Ngọ",
    },
  },
} satisfies Record<GuestSide, GuestSideConfig>;

export const VENUE_PLACEHOLDERS: Record<
  GuestSide,
  { name: string; address: string }
> = {
  groom: {
    name: "Tràng An Palace",
    address: "Số 1 Ngụy Như Kon Tum, Thanh Xuân, Hà Nội",
  },
  bride: {
    name: "Tư gia nhà gái",
    address: "Số nhà 1, Ngách 3 ,Ngõ 6, Bất Bạt, Hà Nội",
  },
};

export const calculateTimeLeft = (isoDate = DEFAULT_EVENT_DATE): TimeLeft => {
  const remaining = Math.max(0, new Date(isoDate).getTime() - Date.now());
  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60),
  };
};

export const downloadCalendarInvite = (date: GuestSideDate) => {
  const toIcsDate = (date: Date) => {
    const pad = (value: number) => String(value).padStart(2, "0");
    return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
  };
  const escapeIcsText = (value: string) => value.replace(/([,;])/g, "\\$1");
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nam & Mai Wedding//VI",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:nam-mai-wedding-${new Date(date.iso).getTime()}@save-the-date-nam-mai.dewna.it.com`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(new Date(date.iso))}`,
    `DTEND:${toIcsDate(new Date(new Date(date.iso).getTime() + 3 * 60 * 60 * 1000))}`,
    `SUMMARY:${escapeIcsText("Lễ thành hôn Nguyễn Thành Nam & Ngô Tuyết Mai")}`,
    `DESCRIPTION:${escapeIcsText("Trân trọng kính mời bạn đến chung vui trong lễ thành hôn của Nguyễn Thành Nam và Ngô Tuyết Mai.")}`,
    `LOCATION:${escapeIcsText("Thông tin địa điểm sẽ được cập nhật")}`,
    "END:VEVENT",
    "END:VCALENDAR",
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
