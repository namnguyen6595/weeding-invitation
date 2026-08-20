import { memo } from "react";
import { downloadCalendarInvite, SEPTEMBER_DAYS } from "./constants";
import { Botanical } from "./Botanical";

export const SaveDateSection = memo(function SaveDateSection() {
  return (
    <section className="save-date-section" id="save-the-date">
      <Botanical className="dark-leaf dark-leaf-one" />
      <div className="scroll-reveal">
        <p className="micro-title light">Save the date</p>
        <h2>September</h2>
        <p className="calendar-year numeric">2026</p>
        <div className="calendar" aria-label="Lịch tháng 9 năm 2026">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <strong key={`${day}-${index}`}>{day}</strong>
          ))}
          {SEPTEMBER_DAYS.map((day, index) => (
            <span
              className={day === 20 ? "wedding-day" : ""}
              key={`${day}-${index}`}
            >
              {day}
            </span>
          ))}
        </div>
        <p className="save-date-note">Chủ Nhật · 11 giờ trưa</p>
        <button
          type="button"
          className="add-to-calendar"
          onClick={downloadCalendarInvite}
        >
          Lưu vào lịch <span>↓</span>
        </button>
      </div>
    </section>
  );
});
