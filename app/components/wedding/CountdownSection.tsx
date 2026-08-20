import { memo } from "react";
import { useFamilyContext } from "@/app/context/FamilyContext";

type CountdownSectionProps = {
  countdown: [number, string][];
  onRsvp: () => void;
};

export const CountdownSection = memo(function CountdownSection({
  countdown,
  onRsvp,
}: CountdownSectionProps) {
  const { guestContext } = useFamilyContext();

  return (
    <section className="countdown-section">
      <div className="scroll-reveal">
        <p className="micro-title light">Counting down</p>
        <h2>
          Hẹn gặp bạn
          <br />
          <i>trong ngày vui</i>
        </h2>
        <p className="countdown-event">
          {guestContext?.venueLabel} · {guestContext?.date.display}
        </p>
        <div className="countdown">
          {countdown.map(([value, label]) => (
            <div key={label}>
              <strong className="numeric">
                {String(value).padStart(2, "0")}
              </strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <button type="button" onClick={onRsvp}>
          Xác nhận tham dự
        </button>
      </div>
    </section>
  );
});
