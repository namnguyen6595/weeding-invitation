import { memo } from "react";

type CountdownSectionProps = { countdown: [number, string][]; onRsvp: () => void };

export const CountdownSection = memo(function CountdownSection({ countdown, onRsvp }: CountdownSectionProps) {
  return <section className="countdown-section"><div className="scroll-reveal"><p className="micro-title light">Counting down</p><h2>Hẹn gặp bạn<br /><i>trong ngày vui</i></h2><div className="countdown">{countdown.map(([value, label]) => <div key={label}><strong className="numeric">{String(value).padStart(2, "0")}</strong><span>{label}</span></div>)}</div><button type="button" onClick={onRsvp}>Xác nhận tham dự</button></div></section>;
});
