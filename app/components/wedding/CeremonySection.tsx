import { memo } from "react";
import { VENUE_PLACEHOLDERS } from "./constants";
import { useFamilyContext } from "@/app/context/FamilyContext";

export const CeremonySection = memo(function CeremonySection() {
  const { guestSide, guestContext } = useFamilyContext();
  const placeholders = guestSide ? VENUE_PLACEHOLDERS[guestSide] : null;
  return (
    <section className="ceremony-section paper-section">
      <div className="date-editorial scroll-reveal">
        <p className="micro-title">The wedding</p>
        <div className="date-lockup">
          <span>{guestContext?.date.month}</span>
          <strong className="numeric">{guestContext?.date.day}</strong>
          <span>{guestContext?.date.year}</span>
        </div>
        <p className="lunar-date">{guestContext?.date.lunar}</p>
      </div>
      <div className="venue-block scroll-reveal">
        <p className="micro-title">Địa điểm tổ chức</p>
        <p className="venue-label">{guestContext?.venueLabel}</p>
        <h2>
          {guestContext ? guestContext.venueName || placeholders?.name : ""}
        </h2>
        <p className="venue-placeholder">
          {guestContext ? guestContext.address || placeholders?.address : ""}
        </p>
        {guestContext?.mapUrl ? (
          <a
            href={guestContext.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Xem chỉ đường <span>↗</span>
          </a>
        ) : (
          <p className="venue-map-note">Bản đồ sẽ được cập nhật</p>
        )}
      </div>
    </section>
  );
});
