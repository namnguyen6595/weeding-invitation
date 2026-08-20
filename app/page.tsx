"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

const WEDDING_DATE = new Date("2026-09-20T11:00:00+07:00");
const WEDDING_DATE_END = new Date("2026-09-20T14:00:00+07:00");
const VENUE_NAME = "Tràng An Palace";
const VENUE_ADDRESS = "Số 1 Ngụy Như Kon Tum";
const MUSIC_URL = "https://www.youtube.com/embed/PEM0Vs8jf1w?autoplay=1&controls=0&loop=1&playlist=PEM0Vs8jf1w&playsinline=1";
const PHOTO_URLS = Array.from(
  { length: 36 },
  (_, index) => `https://pub-f56b79df70fa43399d2d0de06b99b7bf.r2.dev/anh-cuoi/photo-${String(index + 1).padStart(3, "0")}.webp`,
);
const SEPTEMBER_DAYS = [...Array(2).fill(null), ...Array.from({ length: 30 }, (_, index) => index + 1)];

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

const calculateTimeLeft = (): TimeLeft => {
  const remaining = Math.max(0, WEDDING_DATE.getTime() - Date.now());
  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60),
  };
};

const toIcsDate = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
};

const escapeIcsText = (value: string) => value.replace(/([,;])/g, "\\$1");

const downloadCalendarInvite = () => {
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nam & Mai Wedding//VI",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:nam-mai-wedding-${WEDDING_DATE.getTime()}@save-the-date-nam-mai.dewna.it.com`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(WEDDING_DATE)}`,
    `DTEND:${toIcsDate(WEDDING_DATE_END)}`,
    `SUMMARY:${escapeIcsText("Lễ thành hôn Nguyễn Thành Nam & Ngô Tuyết Mai")}`,
    `DESCRIPTION:${escapeIcsText("Trân trọng kính mời bạn đến chung vui trong lễ thành hôn của Nguyễn Thành Nam và Ngô Tuyết Mai.")}`,
    `LOCATION:${escapeIcsText(`${VENUE_NAME}, ${VENUE_ADDRESS}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "nam-mai-wedding.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

const Botanical = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 130 210" aria-hidden="true">
    <path d="M63 207c5-69 8-134 48-196" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <path d="M77 151C50 142 33 122 27 93c28 4 47 21 53 46M87 116c-2-31 8-58 31-79 9 32 0 60-28 82M68 180c-22-4-40-17-52-40 28-2 46 10 54 31" fill="none" stroke="currentColor" strokeWidth="1.1" />
  </svg>
);

export default function Home() {
  const [musicOn, setMusicOn] = useState(false);
  const [showRsvp, setShowRsvp] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpError, setRsvpError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const firstFrame = window.requestAnimationFrame(() => setTimeLeft(calculateTimeLeft()));
    const timer = window.setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = showRsvp || selectedPhoto !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showRsvp, selectedPhoto]);

  useEffect(() => {
    let started = false;
    const removeListeners = () => {
      window.removeEventListener("scroll", startMusic);
      window.removeEventListener("wheel", startMusic);
      window.removeEventListener("touchmove", startMusic);
    };
    const startMusic = () => {
      if (started) return;
      started = true;
      setMusicOn(true);
      removeListeners();
    };
    window.addEventListener("scroll", startMusic, { passive: true });
    window.addEventListener("wheel", startMusic, { passive: true });
    window.addEventListener("touchmove", startMusic, { passive: true });
    return removeListeners;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { rootMargin: "0px 0px -10%", threshold: 0.08 },
    );
    const elements = document.querySelectorAll<HTMLElement>(".scroll-reveal");
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selectedPhoto === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedPhoto(null);
      if (event.key === "ArrowRight") setSelectedPhoto((selectedPhoto + 1) % PHOTO_URLS.length);
      if (event.key === "ArrowLeft") setSelectedPhoto((selectedPhoto - 1 + PHOTO_URLS.length) % PHOTO_URLS.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedPhoto]);

  const countdown = useMemo(() => [
    [timeLeft.days, "Ngày"], [timeLeft.hours, "Giờ"],
    [timeLeft.minutes, "Phút"], [timeLeft.seconds, "Giây"],
  ], [timeLeft]);

  const scrollGallery = (direction: -1 | 1) => {
    const container = galleryRef.current;
    const item = container?.querySelector<HTMLElement>(".album-slide");
    if (!container || !item) return;
    const gap = Number.parseFloat(window.getComputedStyle(container).gap) || 0;
    container.scrollBy({ left: direction * (item.offsetWidth + gap), behavior: "smooth" });
  };

  const submitRsvp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setRsvpError(null);
    setRsvpSubmitting(true);
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: formData.get("guestName"),
          attendance: formData.get("attendance"),
          guests: formData.get("guests"),
          family: formData.get("family"),
          message: formData.get("message"),
        }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(payload?.error || "Không thể gửi phản hồi, vui lòng thử lại.");
      }
      setSubmitted(true);
      form.reset();
    } catch (error) {
      setRsvpError(error instanceof Error ? error.message : "Không thể gửi phản hồi, vui lòng thử lại.");
    } finally {
      setRsvpSubmitting(false);
    }
  };

  return (
    <main className="invitation-canvas">
      {musicOn && <iframe className="music-frame" src={MUSIC_URL} title="Golden Hour — JVKE" allow="autoplay; encrypted-media" />}

      <button className={`music-control ${musicOn ? "is-playing" : ""}`} type="button" onClick={() => setMusicOn((value) => !value)} aria-label={musicOn ? "Tắt nhạc" : "Bật nhạc"}>
        <span className="music-bars" aria-hidden="true"><i /><i /><i /></span>
        <span>{musicOn ? "Music on" : "Music off"}</span>
      </button>

      <section className="cover-section">
        <img src={PHOTO_URLS[5]} alt="Nam và Mai trong bộ ảnh cưới" fetchPriority="high" />
        <div className="cover-shade" />
        <div className="cover-copy">
          <p>We are getting married</p>
          <h1><span>Nguyễn Thành Nam</span><i>&amp;</i><span>Ngô Tuyết Mai</span></h1>
          <div className="cover-date numeric">20 · 09 · 2026</div>
        </div>
        <a className="cover-scroll" href="#save-the-date" aria-label="Cuộn xuống xem thiệp"><span>Scroll</span><i>⌄</i></a>
      </section>

      <section className="save-date-section" id="save-the-date">
        <Botanical className="dark-leaf dark-leaf-one" />
        <div className="scroll-reveal">
          <p className="micro-title light">Save the date</p>
          <h2>September</h2>
          <p className="calendar-year numeric">2026</p>
          <div className="calendar" aria-label="Lịch tháng 9 năm 2026">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => <strong key={`${day}-${index}`}>{day}</strong>)}
            {SEPTEMBER_DAYS.map((day, index) => <span className={day === 20 ? "wedding-day" : ""} key={`${day}-${index}`}>{day}</span>)}
          </div>
          <p className="save-date-note">Chủ Nhật · 11 giờ trưa</p>
          <button type="button" className="add-to-calendar" onClick={downloadCalendarInvite}>
            Lưu vào lịch <span>↓</span>
          </button>
        </div>
      </section>

      <section className="families-section paper-section">
        <div className="section-heading scroll-reveal">
          <p className="micro-title">Trân trọng báo tin</p>
          <h2>Wedding Day</h2>
          <p>Hai gia đình chúng tôi hân hoan báo tin lễ thành hôn của hai con</p>
        </div>
        <div className="portrait-stack scroll-reveal">
          <article className="portrait-card">
            <img src={PHOTO_URLS[8]} alt="Chú rể Nguyễn Thành Nam" loading="lazy" />
            <div><span>Chú rể</span><h3>Nguyễn Thành Nam</h3></div>
          </article>
          <article className="portrait-card offset" style={{
            margin: 0
          }}>
            <img src={PHOTO_URLS[7]} alt="Cô dâu Ngô Tuyết Mai" loading="lazy" />
            <div><span>Cô dâu</span><h3>Ngô Tuyết Mai</h3></div>
          </article>
        </div>
        <div className="parent-grid scroll-reveal">
          <article><p>Nhà trai</p><span>Ông</span><strong>Nguyễn Mạnh Hồng</strong><span>Bà</span><strong>Chu Thị Tám</strong></article>
          <article><p>Nhà gái</p><span>Ông</span><strong>Ngô Văn Đắc</strong><span>Bà</span><strong>Nguyễn Thị Hồng Phương</strong></article>
        </div>
      </section>

      <section className="story-section">
        <Botanical className="story-leaf" />
        <div className="story-card scroll-reveal">
          <p className="micro-title light">Our story</p>
          <h2>Chuyện của<br /><i>chúng mình</i></h2>
          <div className="story-photo"><img src={PHOTO_URLS[3]} alt="Khoảnh khắc của Nam và Mai" loading="lazy" /><span>Nam &amp; Mai</span></div>
          <p>Giữa muôn vàn cuộc gặp gỡ, chúng mình đã tìm thấy nhau — và chọn cùng nhau đi hết hành trình phía trước.</p>
          <p>Với tất cả niềm vui và sự trân trọng, chúng mình thân mời bạn đến chung vui trong ngày thành hôn. Sự hiện diện của bạn là món quà ý nghĩa nhất.</p>
        </div>
      </section>

      <section className="ceremony-section paper-section">
        <div className="date-editorial scroll-reveal">
          <p className="micro-title">The wedding</p>
          <div className="date-lockup"><span>Tháng 09</span><strong className="numeric">20</strong><span>2026</span></div>
          <p className="lunar-date">Tức ngày 10 tháng 08 năm Bính Ngọ</p>
        </div>
        <div className="venue-block scroll-reveal">
          <p className="micro-title">Địa điểm tổ chức</p>
          <h2>{VENUE_NAME}</h2>
          <p className="venue-placeholder">{VENUE_ADDRESS}</p>
          <a href="https://maps.app.goo.gl/EzCNyYDPnzLNU4fB9" target="_blank" rel="noopener noreferrer">Xem chỉ đường <span>↗</span></a>
        </div>
      </section>

      <section className="timeline-section">
        <img className="timeline-photo" src={PHOTO_URLS[4]} alt="Ảnh cưới Nam và Mai" loading="lazy" />
        <div className="timeline-content scroll-reveal">
          <p className="micro-title light">Wedding timeline</p>
          <h2>Timeline</h2>
          <div className="timeline-list">
            <div><time className="numeric">10:30</time><span>Đón khách</span></div>
            <div><time className="numeric">11:00</time><span>Khai tiệc</span></div>
            <div><time className="numeric">11:30</time><span>Nâng ly chúc mừng</span></div>
            <div><time className="numeric">13:00</time><span>Lưu giữ kỷ niệm</span></div>
          </div>
        </div>
      </section>

      <section className="album-section paper-section" id="gallery">
        <Botanical className="album-leaf" />
        <div className="album-heading scroll-reveal">
          <p className="micro-title">Our moments</p>
          <h2>Album <i>of</i><br />Love</h2>
          <p>Những khoảnh khắc nhỏ, một hành trình thật dài.</p>
        </div>
        <div className="album-controls scroll-reveal">
          <span>Vuốt để xem</span>
          <div><button type="button" onClick={() => scrollGallery(-1)} aria-label="Ảnh trước">←</button><button type="button" onClick={() => scrollGallery(1)} aria-label="Ảnh tiếp theo">→</button></div>
        </div>
        <div className="album-track scroll-reveal" ref={galleryRef} role="region" aria-label="Album ảnh cưới">
          {PHOTO_URLS.map((src, index) => (
            <button className="album-slide" type="button" key={src} onClick={() => setSelectedPhoto(index)} aria-label={`Xem ảnh cưới ${index + 1}`}>
              <img src={src} alt={`Ảnh cưới Nam và Mai — ${index + 1}`} loading={index < 3 ? "eager" : "lazy"} decoding="async" />
              <span className="numeric">{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="countdown-section">
        <div className="scroll-reveal">
          <p className="micro-title light">Counting down</p>
          <h2>Hẹn gặp bạn<br /><i>trong ngày vui</i></h2>
          <div className="countdown">{countdown.map(([value, label]) => <div key={label}><strong className="numeric">{String(value).padStart(2, "0")}</strong><span>{label}</span></div>)}</div>
          <button type="button" onClick={() => { setSubmitted(false); setShowRsvp(true); }}>Xác nhận tham dự</button>
        </div>
      </section>

      <footer><p>Thank you</p><h2>Nam <i>&amp;</i> Mai</h2><span className="numeric">20 · 09 · 2026</span></footer>

      {showRsvp && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="rsvp-title">
          <div className="rsvp-modal">
            <button className="modal-close" type="button" onClick={() => setShowRsvp(false)} aria-label="Đóng">×</button>
            {!submitted ? <>
              <p className="micro-title">RSVP</p><h2 id="rsvp-title">Xác nhận tham dự</h2><p className="modal-intro">Cảm ơn bạn đã dành thời gian hồi đáp lời mời của Nam &amp; Mai.</p>
              <form onSubmit={submitRsvp}>
                <label>Họ và tên<input name="guestName" required placeholder="Tên của bạn" /></label>
                <label>Bạn sẽ tham dự chứ?<select name="attendance" required defaultValue=""><option value="" disabled>Chọn phản hồi</option><option value="yes">Mình sẽ tham dự</option><option value="no">Rất tiếc, mình không thể đến</option></select></label>
                <label>Số người tham dự<select name="guests" defaultValue="1"><option>1</option><option>2</option><option>3</option><option>4</option></select></label>
                <label>Bạn là khách của<select name="family" defaultValue=""><option value="" disabled>Chọn nhà trai / nhà gái</option><option value="groom">Nhà trai</option><option value="bride">Nhà gái</option></select></label>
                <label>Lời nhắn<textarea name="message" rows={3} placeholder="Gửi một lời chúc đến cô dâu chú rể..." /></label>
                {rsvpError && <p className="form-error" role="alert">{rsvpError}</p>}
                <button className="submit-button" type="submit" disabled={rsvpSubmitting}>
                  {rsvpSubmitting ? "Đang gửi..." : "Gửi lời hồi đáp"}
                </button>
              </form>
            </> : <div className="thank-you"><span>✓</span><p className="micro-title">Cảm ơn bạn</p><h2>Phản hồi đã được ghi nhận</h2><p>Nam &amp; Mai rất mong được gặp bạn trong ngày trọng đại.</p><button type="button" onClick={() => setShowRsvp(false)}>Đóng</button></div>}
          </div>
        </div>
      )}

      {selectedPhoto !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Ảnh ${selectedPhoto + 1} trên 36`} onClick={() => setSelectedPhoto(null)}>
          <button className="lightbox-close" type="button" onClick={() => setSelectedPhoto(null)} aria-label="Đóng ảnh">×</button>
          <button className="lightbox-prev" type="button" onClick={(event) => { event.stopPropagation(); setSelectedPhoto((selectedPhoto - 1 + PHOTO_URLS.length) % PHOTO_URLS.length); }} aria-label="Ảnh trước">‹</button>
          <figure onClick={(event) => event.stopPropagation()}><img src={PHOTO_URLS[selectedPhoto]} alt={`Ảnh cưới Nam và Mai — ${selectedPhoto + 1}`} /><figcaption className="numeric">{String(selectedPhoto + 1).padStart(2, "0")} / 36</figcaption></figure>
          <button className="lightbox-next" type="button" onClick={(event) => { event.stopPropagation(); setSelectedPhoto((selectedPhoto + 1) % PHOTO_URLS.length); }} aria-label="Ảnh tiếp theo">›</button>
        </div>
      )}
    </main>
  );
}
