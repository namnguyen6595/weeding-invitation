import type { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { PHOTO_URLS } from "./constants";

type PhotoLightboxProps = { selectedPhoto: number; setSelectedPhoto: Dispatch<SetStateAction<number | null>> };

export function PhotoLightbox({ selectedPhoto, setSelectedPhoto }: PhotoLightboxProps) {
  return <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Ảnh ${selectedPhoto + 1} trên 36`} onClick={() => setSelectedPhoto(null)}><button className="lightbox-close" type="button" onClick={() => setSelectedPhoto(null)} aria-label="Đóng ảnh">×</button><button className="lightbox-prev" type="button" onClick={(event) => { event.stopPropagation(); setSelectedPhoto((selectedPhoto - 1 + PHOTO_URLS.length) % PHOTO_URLS.length); }} aria-label="Ảnh trước">‹</button><figure onClick={(event) => event.stopPropagation()}><Image src={PHOTO_URLS[selectedPhoto]} alt={`Ảnh cưới Nam và Mai — ${selectedPhoto + 1}`} width={1200} height={1600} priority unoptimized /><figcaption className="numeric">{String(selectedPhoto + 1).padStart(2, "0")} / 36</figcaption></figure><button className="lightbox-next" type="button" onClick={(event) => { event.stopPropagation(); setSelectedPhoto((selectedPhoto + 1) % PHOTO_URLS.length); }} aria-label="Ảnh tiếp theo">›</button></div>;
}
