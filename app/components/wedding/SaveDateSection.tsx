import { memo } from "react";
import { downloadCalendarInvite, SEPTEMBER_DAYS } from "./constants";
import { Botanical } from "./Botanical";
import { useFamilyContext } from "@/app/context/FamilyContext";

export const SaveDateSection = memo(function SaveDateSection() {
  const { guestContext } = useFamilyContext();
  const date = guestContext?.date;

  return (
    <section className="save-date-section" id="save-the-date">
      <Botanical className="dark-leaf dark-leaf-one" />
      <div className="scroll-reveal">
        <p className="micro-title light">Save the date</p>
        <h2>{date?.month.replace("Tháng ", "") === "09" ? "September" : date?.month}</h2>
        <p className="calendar-year numeric">{date?.year}</p>
        <div className="calendar" aria-label="Lịch tháng 9 năm 2026">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <strong key={`${day}-${index}`}>{day}</strong>
          ))}
          {SEPTEMBER_DAYS.map((day, index) => (
            <span
              className={day === date?.day ? "wedding-day" : ""}
              key={`${day}-${index}`}
            >
              {day}
            </span>
          ))}
        </div>
        <p className="save-date-note">{date?.time}</p>
        <button
          type="button"
          className="add-to-calendar"
          onClick={() => date && downloadCalendarInvite(date)}
        >
          Lưu vào lịch <span>↓</span>
        </button>
      </div>
    </section>
  );
});
