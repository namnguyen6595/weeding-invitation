"use client";

import { FormEvent, useEffect, useState } from "react";

export function MusicSettingsForm() {
  const [musicUrl, setMusicUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() as Promise<{ musicUrl?: string }> : null)
      .then((payload) => setMusicUrl(payload?.musicUrl ?? ""))
      .catch(() => undefined);
  }, []);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ musicUrl }),
    });
    const payload = await response.json().catch(() => null) as { error?: string } | null;
    setSaving(false);
    setMessage(response.ok ? "Đã lưu link nhạc." : payload?.error || "Không thể lưu link nhạc.");
  };

  return <section className="admin-config-editor"><div className="admin-section-heading"><div><p className="admin-eyebrow">Background music</p><h2>Nhạc nền</h2></div>{message && <span className="admin-save-message">{message}</span>}</div><form className="admin-config-card admin-music-form" onSubmit={save}><label>MP3 URL<input type="url" value={musicUrl} onChange={(event) => setMusicUrl(event.target.value)} placeholder="https://.../music.mp3" required /></label><p>Nhạc được phát bằng trình phát audio native sau khi khách bấm nút Music.</p><button type="submit" disabled={saving}>{saving ? "Đang lưu…" : "Lưu link nhạc"}</button></form></section>;
}
