"use client";

import { memo, useCallback, useRef, type Dispatch, type SetStateAction } from "react";
import { PHOTO_URLS } from "./constants";
import { Botanical } from "./Botanical";
import { DeferredAlbumImage } from "./DeferredAlbumImage";

type AlbumSectionProps = {
  setSelectedPhoto: Dispatch<SetStateAction<number | null>>;
};

export const AlbumSection = memo(function AlbumSection({
  setSelectedPhoto,
}: AlbumSectionProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const scrollGallery = useCallback((direction: -1 | 1) => {
    const container = galleryRef.current;
    const item = container?.querySelector<HTMLElement>(".album-slide");
    if (!container || !item) return;
    const gap = Number.parseFloat(window.getComputedStyle(container).gap) || 0;
    container.scrollBy({ left: direction * (item.offsetWidth + gap), behavior: "smooth" });
  }, []);

  return (
    <section className="album-section paper-section" id="gallery">
      <Botanical className="album-leaf" />
      <div className="album-heading scroll-reveal">
        <p className="micro-title">Our moments</p>
        <h2>
          Album <i>of</i>
          <br />
          Love
        </h2>
        <p>Những khoảnh khắc nhỏ, một hành trình thật dài.</p>
      </div>
      <div className="album-controls scroll-reveal">
        <span>Vuốt để xem</span>
        <div>
          <button
            type="button"
            onClick={() => scrollGallery(-1)}
            aria-label="Ảnh trước"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollGallery(1)}
            aria-label="Ảnh tiếp theo"
          >
            →
          </button>
        </div>
      </div>
      <div
        className="album-track scroll-reveal"
        ref={galleryRef}
        role="region"
        aria-label="Album ảnh cưới"
      >
        {PHOTO_URLS.map((src, index) => (
          <button
            className="album-slide"
            type="button"
            key={src}
            onClick={() => setSelectedPhoto(index)}
            aria-label={`Xem ảnh cưới ${index + 1}`}
          >
            <DeferredAlbumImage
              src={src}
              alt={`Ảnh cưới Nam và Mai - ${index + 1}`}
              galleryRef={galleryRef}
            />{" "}
            <span className="numeric">
              {String(index + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
});
