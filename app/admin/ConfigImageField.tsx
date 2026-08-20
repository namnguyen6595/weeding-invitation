"use client";

import Image from "next/image";
import { useState } from "react";
import { GalleryPickerModal } from "./GalleryPickerModal";

type ConfigImageFieldProps = {
  label: string;
  alt: string;
  value: string;
  onChange: (value: string) => void;
};

export function ConfigImageField({ label, alt, value, onChange }: ConfigImageFieldProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return <div className="admin-image-field"><span>{label}</span><div className="admin-image-preview">{value ? <Image src={value} alt={alt} fill sizes="(max-width: 680px) 100vw, 250px" unoptimized /> : <span>Chọn một ảnh từ gallery</span>}</div><button className="admin-image-select" type="button" onClick={() => setIsPickerOpen(true)}>{value ? "Đổi ảnh" : "Chọn ảnh"}</button><GalleryPickerModal isOpen={isPickerOpen} selectedUrl={value} onClose={() => setIsPickerOpen(false)} onSelect={onChange} /></div>;
}
