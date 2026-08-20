"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { GUEST_SIDES, withEventDate, type GuestSide, type GuestSideConfig } from "@/app/components/wedding/constants";
import { WeddingConfigForm } from "./WeddingConfigForm";
import "./admin.css";

type Rsvp = { id: number; guestName: string; attendance: "yes" | "no"; guestCount: number; family: GuestSide; message: string; createdAt: string };
type EditableField = "venueName" | "address" | "mapUrl" | "musicUrl" | "coverImageUrl" | "familiesGroomImageUrl" | "familiesBrideImageUrl" | "storyImageUrl" | "timelineImageUrl";

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | GuestSide>("all");
  const [configs, setConfigs] = useState<Record<GuestSide, GuestSideConfig>>(GUEST_SIDES);
  const [savingConfig, setSavingConfig] = useState<GuestSide | null>(null);
  const [configMessage, setConfigMessage] = useState("");

  const loadRsvps = async () => {
    const response = await fetch("/api/admin/rsvps", { cache: "no-store" });
    if (response.status === 401) { setAuthenticated(false); return; }
    const payload = (await response.json()) as { rsvps?: Rsvp[] };
    setRsvps(payload.rsvps ?? []);
    setAuthenticated(true);
  };

  const loadConfigs = async () => {
    const response = await fetch("/api/admin/config", { cache: "no-store" });
    if (!response.ok) return;
    const payload = (await response.json()) as { configs?: Record<GuestSide, GuestSideConfig> };
    if (payload.configs) setConfigs(payload.configs);
  };

  useEffect(() => {
    let cancelled = false;
    const checkSession = async () => {
      const response = await fetch("/api/admin/rsvps", { cache: "no-store" });
      if (cancelled) return;
      if (response.status === 401) { setAuthenticated(false); return; }
      const payload = (await response.json()) as { rsvps?: Rsvp[] };
      if (!cancelled) {
        setRsvps(payload.rsvps ?? []);
        setAuthenticated(true);
        void loadConfigs();
      }
    };
    void checkSession();
    return () => { cancelled = true; };
  }, []);

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setLoginError("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
    if (!response.ok) { setLoginError("Tên đăng nhập hoặc mật khẩu không đúng."); setLoading(false); return; }
    setPassword("");
    await loadRsvps();
    await loadConfigs();
    setLoading(false);
  };

  const updateConfig = (side: GuestSide, field: EditableField, value: string) => setConfigs((current) => ({ ...current, [side]: { ...current[side], [field]: value } }));
  const updateConfigDate = (side: GuestSide, value: string) => setConfigs((current) => ({ ...current, [side]: withEventDate(current[side], `${value}:00+07:00`) }));

  const saveConfig = async (event: FormEvent<HTMLFormElement>, side: GuestSide) => {
    event.preventDefault();
    setSavingConfig(side);
    setConfigMessage("");
    const config = configs[side];
    const response = await fetch("/api/admin/config", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ family: side, venueName: config.venueName, address: config.address, mapUrl: config.mapUrl, musicUrl: config.musicUrl, coverImageUrl: config.coverImageUrl, familiesGroomImageUrl: config.familiesGroomImageUrl, familiesBrideImageUrl: config.familiesBrideImageUrl, storyImageUrl: config.storyImageUrl, timelineImageUrl: config.timelineImageUrl, eventDate: config.date.iso }) });
    setSavingConfig(null);
    setConfigMessage(response.ok ? "Đã lưu cấu hình." : "Không thể lưu cấu hình.");
  };

  const logout = async () => { await fetch("/api/admin/logout", { method: "POST" }); setAuthenticated(false); setRsvps([]); };
  const visibleRsvps = useMemo(() => filter === "all" ? rsvps : rsvps.filter((rsvp) => rsvp.family === filter), [filter, rsvps]);
  const attending = rsvps.filter((rsvp) => rsvp.attendance === "yes");
  const guestCount = attending.reduce((total, rsvp) => total + rsvp.guestCount, 0);

  if (authenticated === null) return <main className="admin-page"><div className="admin-loading">Đang kiểm tra phiên đăng nhập…</div></main>;
  if (!authenticated) return <main className="admin-page"><section className="admin-login"><p className="admin-eyebrow">Nam &amp; Mai · Private area</p><h1>Quản lý thiệp cưới</h1><p>Đăng nhập để xem phản hồi và lời chúc của khách mời.</p><form onSubmit={submitLogin}><label>Tên đăng nhập<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required /></label><label>Mật khẩu<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>{loginError && <div className="admin-error" role="alert">{loginError}</div>}<button type="submit" disabled={loading}>{loading ? "Đang xác thực…" : "Đăng nhập"}</button></form></section></main>;

  return <main className="admin-page"><header className="admin-header"><div><p className="admin-eyebrow">Wedding dashboard</p><h1>Nam &amp; Mai</h1></div><button className="admin-logout" type="button" onClick={logout}>Đăng xuất</button></header><section className="admin-config-editor"><div className="admin-section-heading"><div><p className="admin-eyebrow">Wedding settings</p><h2>Cấu hình thông tin hai bên</h2></div>{configMessage && <span className="admin-save-message">{configMessage}</span>}</div><div className="admin-config-grid">{(["groom", "bride"] as GuestSide[]).map((side) => <WeddingConfigForm key={side} side={side} config={configs[side]} saving={savingConfig === side} onFieldChange={(field, value) => updateConfig(side, field, value)} onDateChange={(value) => updateConfigDate(side, value)} onSubmit={(event) => saveConfig(event, side)} />)}</div></section><section className="admin-summary"><article><span>Tổng phản hồi</span><strong>{rsvps.length}</strong></article><article><span>Sẽ tham dự</span><strong>{attending.length}</strong></article><article><span>Tổng số khách</span><strong>{guestCount}</strong></article><article><span>Lời chúc</span><strong>{rsvps.filter((rsvp) => rsvp.message.trim()).length}</strong></article></section><section className="admin-responses"><div className="admin-section-heading"><div><p className="admin-eyebrow">Guest responses</p><h2>Danh sách khách mời</h2></div><select value={filter} onChange={(event) => setFilter(event.target.value as "all" | GuestSide)}><option value="all">Tất cả</option><option value="groom">Nhà trai</option><option value="bride">Nhà gái</option></select></div>{visibleRsvps.length === 0 ? <p className="admin-empty">Chưa có phản hồi nào.</p> : <div className="admin-table-wrap"><table><thead><tr><th>Khách mời</th><th>Phía</th><th>Phản hồi</th><th>Số người</th><th>Lời chúc</th><th>Thời gian</th></tr></thead><tbody>{visibleRsvps.map((rsvp) => <tr key={rsvp.id}><td>{rsvp.guestName}</td><td>{rsvp.family === "groom" ? "Nhà trai" : "Nhà gái"}</td><td><span className={`admin-status ${rsvp.attendance}`}>{rsvp.attendance === "yes" ? "Tham dự" : "Không tham dự"}</span></td><td>{rsvp.guestCount}</td><td className="admin-message">{rsvp.message || "-"}</td><td>{new Date(rsvp.createdAt).toLocaleString("vi-VN")}</td></tr>)}</tbody></table></div>}</section></main>;
}
