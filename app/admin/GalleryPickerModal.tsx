"use client";

import Image from "next/image";
import { useEffect } from "react";
import { PHOTO_URLS } from "@/app/components/wedding/constants";

type GalleryPickerModalProps = {
  isOpen: boolean;
  selectedUrl: string;
  onClose: () => void;
  onSelect: (url: string) => void;
};

export function GalleryPickerModal({ isOpen, selectedUrl, onClose, onSelect }: GalleryPickerModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return <div className="admin-gallery-modal" role="dialog" aria-modal="true" aria-labelledby="gallery-picker-title" onClick={onClose}><section onClick={(event) => event.stopPropagation()}><header><div><p>Album ảnh cưới</p><h2 id="gallery-picker-title">Chọn một ảnh</h2></div><button type="button" onClick={onClose} aria-label="Đóng gallery">Đóng</button></header><div className="admin-gallery-grid">{PHOTO_URLS.map((url, index) => <button className={url === selectedUrl ? "is-selected" : ""} type="button" key={url} onClick={() => { onSelect(url); onClose(); }} aria-label={`Chọn ảnh gallery ${index + 1}`}><Image src={url} alt={`Ảnh gallery ${index + 1}`} width={300} height={380} loading="lazy" unoptimized /></button>)}</div></section></div>;
}
