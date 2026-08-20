import { R2_PUBLIC_ORIGIN } from "@/app/components/wedding/constants";

const MEDIA_CACHE_CONTROL = "public, max-age=31536000, immutable";
const FORWARDED_HEADERS = ["Content-Type", "Content-Length", "Content-Range", "Accept-Ranges", "ETag", "Last-Modified"];

function isAllowedMediaUrl(value: string) {
  try {
    const url = new URL(value);
    return url.origin === R2_PUBLIC_ORIGIN && (url.pathname.endsWith(".webp") || url.pathname.endsWith(".mp3"));
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const source = requestUrl.searchParams.get("src");
  if (!source || !isAllowedMediaUrl(source)) return Response.json({ error: "Unsupported media source" }, { status: 400 });

  const range = request.headers.get("Range");
  const upstream = await fetch(source, { headers: range ? { Range: range } : undefined });
  const headers = new Headers({ "Cache-Control": MEDIA_CACHE_CONTROL });
  for (const headerName of FORWARDED_HEADERS) {
    const value = upstream.headers.get(headerName);
    if (value) headers.set(headerName, value);
  }
  return new Response(upstream.body, { status: upstream.status, headers });
}
