"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";
import { getCachedMediaUrl } from "./constants";

type DeferredAlbumImageProps = {
  src: string;
  alt: string;
  galleryRef: RefObject<HTMLDivElement | null>;
};

export function DeferredAlbumImage({ src, alt, galleryRef }: DeferredAlbumImageProps) {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const placeholder = placeholderRef.current;
    const gallery = galleryRef.current;
    if (!placeholder || !gallery) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { root: gallery, rootMargin: "0px 100% 0px 100%", threshold: 0.01 },
    );
    observer.observe(placeholder);
    return () => observer.disconnect();
  }, [galleryRef]);

  if (!shouldLoad) return <div ref={placeholderRef} className="album-image-placeholder" aria-hidden="true" />;

  return <Image src={getCachedMediaUrl(src)} alt={alt} width={900} height={1200} loading="eager" unoptimized />;
}
