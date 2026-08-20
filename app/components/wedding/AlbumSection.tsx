import { memo, type Dispatch, type RefObject, type SetStateAction } from "react";
import Image from "next/image";
import { PHOTO_URLS } from "./constants";
import { Botanical } from "./Botanical";

type AlbumSectionProps = { galleryRef: RefObject<HTMLDivElement | null>; scrollGallery: (direction: -1 | 1) => void; setSelectedPhoto: Dispatch<SetStateAction<number | null>> };

export const AlbumSection = memo(function AlbumSection({ galleryRef, scrollGallery, setSelectedPhoto }: AlbumSectionProps) {
  return <section className="album-section paper-section" id="gallery"><Botanical className="album-leaf" /><div className="album-heading scroll-reveal"><p className="micro-title">Our moments</p><h2>Album <i>of</i><br />Love</h2><p>Những khoảnh khắc nhỏ, một hành trình thật dài.</p></div><div className="album-controls scroll-reveal"><span>Vuốt để xem</span><div><button type="button" onClick={() => scrollGallery(-1)} aria-label="Ảnh trước">←</button><button type="button" onClick={() => scrollGallery(1)} aria-label="Ảnh tiếp theo">→</button></div></div><div className="album-track scroll-reveal" ref={galleryRef} role="region" aria-label="Album ảnh cưới">{PHOTO_URLS.map((src, index) => <button className="album-slide" type="button" key={src} onClick={() => setSelectedPhoto(index)} aria-label={`Xem ảnh cưới ${index + 1}`}><Image src={src} alt={`Ảnh cưới Nam và Mai — ${index + 1}`} width={900} height={1200} loading={index < 3 ? "eager" : "lazy"} unoptimized /> <span className="numeric">{String(index + 1).padStart(2, "0")}</span></button>)}</div></section>;
});
