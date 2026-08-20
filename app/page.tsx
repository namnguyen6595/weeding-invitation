"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  calculateTimeLeft,
  PHOTO_URLS,
  type GuestSide,
  type TimeLeft,
} from "./components/wedding/constants";
import { useFamilyContext } from "./context/FamilyContext";
import { AlbumSection } from "./components/wedding/AlbumSection";
import { CeremonySection } from "./components/wedding/CeremonySection";
import { CountdownSection } from "./components/wedding/CountdownSection";
import { CoverSection } from "./components/wedding/CoverSection";
import { FamiliesSection } from "./components/wedding/FamiliesSection";
import { SaveDateSection } from "./components/wedding/SaveDateSection";
import { StorySection } from "./components/wedding/StorySection";
import { TimelineSection } from "./components/wedding/TimelineSection";
import { WeddingFooter } from "./components/wedding/WeddingFooter";
import { GuestSideOverlay } from "./components/wedding/GuestSideOverlay";
import { GuestSideSwitcher } from "./components/wedding/GuestSideSwitcher";
import { MusicControl } from "./components/wedding/MusicControl";
import { PhotoLightbox } from "./components/wedding/PhotoLightbox";
import { RsvpModal } from "./components/wedding/RsvpModal";

export default function Home() {
  const { guestSide, setGuestSide, guestContext, musicUrls, isConfigLoading } = useFamilyContext();
  const [musicOn, setMusicOn] = useState(false);
  const [showMusicHint, setShowMusicHint] = useState(true);
  const [showRsvp, setShowRsvp] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpError, setRsvpError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const galleryRef = useRef<HTMLDivElement>(null);
  const audioRefs = useRef<Partial<Record<GuestSide, HTMLAudioElement>>>({});

  useEffect(() => {
    const firstFrame = window.requestAnimationFrame(() =>
      setTimeLeft(calculateTimeLeft(guestContext?.date.iso)),
    );
    const timer = window.setInterval(
      () => setTimeLeft(calculateTimeLeft(guestContext?.date.iso)),
      1000,
    );
    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.clearInterval(timer);
    };
  }, [guestContext?.date.iso]);

  // iOS/Android browsers only allow media playback to start from a discrete
  // tap (touchend that is NOT part of a scroll/pan, or a click) — a visitor
  // who only scrolls, without ever tapping something, will never trigger
  // autoplay, by design of the platform's autoplay policy. Pulse the music
  // button for a few seconds on load so visitors notice there's a tap-to-play
  // control, since scrolling alone can't reliably start audio on mobile.
  useEffect(() => {
    const timeout = window.setTimeout(() => setShowMusicHint(false), 6000);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      guestSide === null || showRsvp || selectedPhoto !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [guestSide, showRsvp, selectedPhoto]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
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
      if (event.key === "ArrowRight")
        setSelectedPhoto((selectedPhoto + 1) % PHOTO_URLS.length);
      if (event.key === "ArrowLeft")
        setSelectedPhoto(
          (selectedPhoto - 1 + PHOTO_URLS.length) % PHOTO_URLS.length,
        );
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedPhoto]);

  const countdown = useMemo<[number, string][]>(
    () => [
      [timeLeft.days, "Ngày"],
      [timeLeft.hours, "Giờ"],
      [timeLeft.minutes, "Phút"],
      [timeLeft.seconds, "Giây"],
    ],
    [timeLeft],
  );

  const scrollGallery = useCallback((direction: -1 | 1) => {
    const container = galleryRef.current;
    const item = container?.querySelector<HTMLElement>(".album-slide");
    if (!container || !item) return;
    const gap = Number.parseFloat(window.getComputedStyle(container).gap) || 0;
    container.scrollBy({
      left: direction * (item.offsetWidth + gap),
      behavior: "smooth",
    });
  }, []);

  const toggleMusic = async () => {
    const audio = guestSide ? audioRefs.current[guestSide] : undefined;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    setShowMusicHint(false);
    try {
      await audio.play();
    } catch {
      setMusicOn(false);
    }
  };

  const selectGuestSide = (side: GuestSide) => {
    setGuestSide(side);
    const audio = audioRefs.current[side];
    if (audio?.paused) {
      setShowMusicHint(false);
      void audio.play().catch(() => setMusicOn(false));
    }
  };

  const changeGuestSide = () => {
    if (guestSide) audioRefs.current[guestSide]?.pause();
    setGuestSide(null);
  };

  const submitRsvp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!guestSide) {
      setRsvpError("Vui lòng chọn nhà trai hoặc nhà gái trước khi gửi.");
      return;
    }
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
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (!response.ok) {
        throw new Error(
          payload?.error || "Không thể gửi phản hồi, vui lòng thử lại.",
        );
      }
      setSubmitted(true);
      form.reset();
    } catch (error) {
      setRsvpError(
        error instanceof Error
          ? error.message
          : "Không thể gửi phản hồi, vui lòng thử lại.",
      );
    } finally {
      setRsvpSubmitting(false);
    }
  };

  return (
    <main className="invitation-canvas">
      <div className="music-frame" aria-hidden="true">
        {(["groom", "bride"] as GuestSide[]).map((side) => musicUrls[side] && <audio key={side} ref={(audio) => { audioRefs.current[side] = audio ?? undefined; }} src={musicUrls[side]} loop preload="metadata" onPlay={() => setMusicOn(true)} onPause={() => setMusicOn(false)} />)}
      </div>

      {guestSide === null && <GuestSideOverlay onSelect={selectGuestSide} disabled={isConfigLoading} />}

      {guestSide && musicUrls[guestSide] && <MusicControl
        musicOn={musicOn}
        showHint={showMusicHint}
        onToggle={toggleMusic}
      />}

      <CoverSection />
      <SaveDateSection />
      <FamiliesSection />
      <StorySection />
      <CeremonySection />
      <TimelineSection />
      <AlbumSection
        galleryRef={galleryRef}
        scrollGallery={scrollGallery}
        setSelectedPhoto={setSelectedPhoto}
      />
      <CountdownSection
        countdown={countdown}
        onRsvp={() => {
          setSubmitted(false);
          setShowRsvp(true);
        }}
      />
      <WeddingFooter />

      {guestContext && (
        <GuestSideSwitcher
          label={guestContext.label}
          onChange={changeGuestSide}
        />
      )}
      {showRsvp && (
        <RsvpModal
          guestSide={guestSide}
          shortLabel={guestContext?.shortLabel}
          submitted={submitted}
          submitting={rsvpSubmitting}
          error={rsvpError}
          onClose={() => setShowRsvp(false)}
          onSubmit={submitRsvp}
        />
      )}
      {selectedPhoto !== null && (
        <PhotoLightbox
          selectedPhoto={selectedPhoto}
          setSelectedPhoto={setSelectedPhoto}
        />
      )}
    </main>
  );
}
