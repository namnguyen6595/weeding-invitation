import type { Metadata } from "next";
import "./globals.css";
import { FamilyContextProvider } from "./context/FamilyContext";

const siteUrl = "https://save-the-date-nam-mai.dewna.it.com";
const title = "Save the Date — Nam & Mai";
const description =
  "Trân trọng kính mời bạn đến chung vui trong lễ thành hôn của Nguyễn Thành Nam và Ngô Tuyết Mai — Chủ Nhật, 20.09.2026.";
const ogImagePath = "/og-image.jpg";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(siteUrl),
  other: { "codex-preview": "development" },
  icons: { icon: "/photo-006.webp", shortcut: "/photo-006.webp" },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: title,
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: ogImagePath,
        width: 1200,
        height: 630,
        alt: "Nguyễn Thành Nam & Ngô Tuyết Mai — 20.09.2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImagePath],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://pub-f56b79df70fa43399d2d0de06b99b7bf.r2.dev"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,500;1,600&family=Marcellus&family=Pinyon+Script&family=Tenor+Sans&display=swap"
        />
      </head>
      <body>
        <FamilyContextProvider>{children}</FamilyContextProvider>
      </body>
    </html>
  );
}
