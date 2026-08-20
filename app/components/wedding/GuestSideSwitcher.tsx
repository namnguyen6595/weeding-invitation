type GuestSideSwitcherProps = { label: string; onChange: () => void };

export function GuestSideSwitcher({ label, onChange }: GuestSideSwitcherProps) {
  return <button className="guest-side-switch" type="button" onClick={onChange}>{label} · Đổi</button>;
}
