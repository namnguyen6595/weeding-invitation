"use client";

import type { FormEvent } from "react";
import type { GuestSide, GuestSideConfig } from "@/app/components/wedding/constants";
import { ConfigImageField } from "./ConfigImageField";

type EditableField = "venueName" | "address" | "mapUrl" | "musicUrl" | "coverImageUrl" | "familiesGroomImageUrl" | "familiesBrideImageUrl" | "storyImageUrl" | "timelineImageUrl";

type WeddingConfigFormProps = {
  side: GuestSide;
  config: GuestSideConfig;
  saving: boolean;
  onFieldChange: (field: EditableField, value: string) => void;
  onDateChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function WeddingConfigForm({ side, config, saving, onFieldChange, onDateChange, onSubmit }: WeddingConfigFormProps) {
  const sideLabel = side === "groom" ? "nhà trai" : "nhà gái";

  return (
    <form className="admin-config-card" onSubmit={onSubmit}>
      <header className="admin-config-card-header">
        <div>
          <span className="admin-config-kicker">{config.shortLabel}</span>
          <h3>Cấu hình {sideLabel}</h3>
        </div>
        <time dateTime={config.date.iso}>{config.date.display}</time>
      </header>

      <section className="admin-form-section" aria-labelledby={`${side}-ceremony-details`}>
        <div className="admin-form-section-heading">
          <h4 id={`${side}-ceremony-details`}>Thông tin buổi lễ</h4>
          <p>Thông tin này hiển thị theo lựa chọn của khách mời.</p>
        </div>
        <div className="admin-field-grid">
          <label className="admin-field"><span>Tên địa điểm</span><input value={config.venueName} onChange={(event) => onFieldChange("venueName", event.target.value)} /></label>
          <label className="admin-field"><span>Ngày và giờ</span><input type="datetime-local" value={config.date.iso.slice(0, 16)} onChange={(event) => onDateChange(event.target.value)} /></label>
          <label className="admin-field admin-field-wide"><span>Địa chỉ</span><input value={config.address} onChange={(event) => onFieldChange("address", event.target.value)} /></label>
          <label className="admin-field admin-field-wide"><span>Google Maps URL</span><input type="url" value={config.mapUrl} onChange={(event) => onFieldChange("mapUrl", event.target.value)} placeholder="https://maps.google.com/..." /></label>
        </div>
      </section>

      <section className="admin-form-section" aria-labelledby={`${side}-music`}>
        <div className="admin-form-section-heading">
          <h4 id={`${side}-music`}>Nhạc nền</h4>
          <p>Phát sau khi khách chọn bên gia đình.</p>
        </div>
        <label className="admin-field"><span>MP3 URL</span><input type="url" value={config.musicUrl} onChange={(event) => onFieldChange("musicUrl", event.target.value)} placeholder="https://.../music.mp3" /></label>
      </section>

      <section className="admin-form-section admin-media-section" aria-labelledby={`${side}-media`}>
        <div className="admin-form-section-heading">
          <h4 id={`${side}-media`}>Ảnh hiển thị</h4>
          <p>Chọn ảnh từ gallery để xem trước. Thay đổi chỉ được lưu khi nhấn nút phía dưới.</p>
        </div>
        <div className="admin-media-grid">
          <ConfigImageField label="Cover" alt={`Ảnh cover ${sideLabel}`} value={config.coverImageUrl} onChange={(value) => onFieldChange("coverImageUrl", value)} />
          <ConfigImageField label="Families - chú rể" alt={`Ảnh chú rể ${sideLabel}`} value={config.familiesGroomImageUrl} onChange={(value) => onFieldChange("familiesGroomImageUrl", value)} />
          <ConfigImageField label="Families - cô dâu" alt={`Ảnh cô dâu ${sideLabel}`} value={config.familiesBrideImageUrl} onChange={(value) => onFieldChange("familiesBrideImageUrl", value)} />
          <ConfigImageField label="Story" alt={`Ảnh story ${sideLabel}`} value={config.storyImageUrl} onChange={(value) => onFieldChange("storyImageUrl", value)} />
          <ConfigImageField label="Timeline" alt={`Ảnh timeline ${sideLabel}`} value={config.timelineImageUrl} onChange={(value) => onFieldChange("timelineImageUrl", value)} />
        </div>
      </section>

      <footer className="admin-config-card-footer">
        <p>Kiểm tra preview ảnh trước khi lưu.</p>
        <button type="submit" disabled={saving}>{saving ? "Đang lưu…" : "Lưu cấu hình"}</button>
      </footer>
    </form>
  );
}
