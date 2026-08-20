import { Botanical } from "./Botanical";
import type { GuestSide } from "./constants";

type GuestSideOverlayProps = { onSelect: (side: GuestSide) => void };

export function GuestSideOverlay({ onSelect }: GuestSideOverlayProps) {
  return <div className="guest-side-overlay" role="dialog" aria-modal="true" aria-labelledby="guest-side-title"><div className="guest-side-card"><Botanical className="guest-side-botanical guest-side-botanical-top" /><Botanical className="guest-side-botanical guest-side-botanical-bottom" /><p className="guest-side-eyebrow">Wedding invitation</p><p className="guest-side-kicker">Nam <i>&amp;</i> Mai</p><p className="guest-side-date numeric">11:00 · 20.09.2026</p><div className="guest-side-ornament" aria-hidden="true" /><h1 id="guest-side-title">Bạn là khách mời của<br />gia đình nào?</h1><div className="guest-side-actions"><button type="button" onClick={() => onSelect("groom")}><span>Nhà trai</span><strong>Nguyễn Thành Nam</strong></button><button type="button" onClick={() => onSelect("bride")}><span>Nhà gái</span><strong>Ngô Tuyết Mai</strong></button></div><p className="guest-side-note">Lựa chọn này giúp hiển thị đúng địa điểm tổ chức dành cho bạn.</p></div></div>;
}
