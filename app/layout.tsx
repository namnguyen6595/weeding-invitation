import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Save the Date — Nam & Mai",
  description: "Trân trọng kính mời bạn đến chung vui trong lễ thành hôn của Nguyễn Thành Nam và Ngô Tuyết Mai.",
  other: { "codex-preview": "development" },
  icons: { icon: "/photo-006.webp", shortcut: "/photo-006.webp" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,500;1,600&family=Marcellus&family=Pinyon+Script&family=Tenor+Sans&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
