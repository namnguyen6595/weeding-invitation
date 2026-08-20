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
  MUSIC_VIDEO_ID,
  PHOTO_URLS,
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

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        options: {
          width?: string | number;
          height?: string | number;
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: { target: YouTubePlayer }) => void;
            onStateChange?: (event: { data: number }) => void;
          };
        },
      ) => YouTubePlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
};

// Played through the YouTube IFrame Player API (not a plain
// <iframe src="...autoplay=1">) because mobile browsers only allow media
// playback to start from a genuine user-activation event — a discrete
// tap/click/keydown — and only when play() is called synchronously inside
// that event handler. Passive gestures like scroll/wheel/touchmove do NOT
// count as activation on iOS Safari or Chrome for Android, which is why the
// previous "play on first scroll" approach silently failed on mobile.
export default function Home() {
  const { guestSide, setGuestSide, guestContext } = useFamilyContext();
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
  const playerRef = useRef<YouTubePlayer | null>(null);
  const playerReadyRef = useRef(false);
  const pendingPlayRef = useRef(false);

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

  // Create the YouTube player as soon as the page loads (not on first
  // interaction) so it's already warmed up by the time the visitor triggers
  // playback. Mobile Safari only allows media playback to begin when
  // playVideo() runs synchronously inside a user-gesture handler — building
  // the iframe *after* the gesture introduces a load delay that Safari's
  // autoplay policy rejects, even though desktop Chrome tolerates it.
  useEffect(() => {
    let cancelled = false;
    const createPlayer = () => {
      if (cancelled || playerRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player("music-player", {
        width: "1",
        height: "1",
        videoId: MUSIC_VIDEO_ID,
        playerVars: {
          autoplay: 0,
          controls: 0,
          loop: 1,
          playlist: MUSIC_VIDEO_ID,
          playsinline: 1,
        },
        events: {
          onReady: () => {
            playerReadyRef.current = true;
            if (pendingPlayRef.current) {
              pendingPlayRef.current = false;
              playerRef.current?.playVideo();
            }
          },
          onStateChange: ({ data }) => {
            // YouTube state 1 is PLAYING. Do not show the animated icon just
            // because a gesture was received: autoplay can still be rejected
            // by the browser or by the YouTube iframe.
            if (data === 1) setMusicOn(true);
            if (data === 0 || data === 2 || data === 5) setMusicOn(false);
          },
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        createPlayer();
      };
      if (
        !document.querySelector(
          'script[src="https://www.youtube.com/iframe_api"]',
        )
      ) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
    }

    return () => {
      cancelled = true;
      playerRef.current?.destroy?.();
      playerRef.current = null;
      playerReadyRef.current = false;
    };
  }, []);

  // Start music at the beginning of the visitor's first interaction. In
  // particular, touchstart/pointerdown happen before the browser begins a
  // scroll, so the YouTube play request still runs inside the user gesture.
  // A wheel event by itself is not a user activation and cannot reliably
  // bypass autoplay policy, but a preceding pointer/touch gesture can.
  useEffect(() => {
    if (guestSide === null) return;
    let started = false;
    const removeListeners = () => {
      window.removeEventListener("pointerdown", startMusic);
      window.removeEventListener("touchstart", startMusic);
      window.removeEventListener("mousedown", startMusic);
      window.removeEventListener("touchend", startMusic);
      window.removeEventListener("click", startMusic);
      window.removeEventListener("keydown", startMusic);
    };
    const startMusic = () => {
      if (started) return;
      started = true;
      if (playerReadyRef.current && playerRef.current) {
        playerRef.current.playVideo();
      } else {
        pendingPlayRef.current = true;
      }
      removeListeners();
    };
    window.addEventListener("pointerdown", startMusic, { passive: true });
    window.addEventListener("touchstart", startMusic, { passive: true });
    window.addEventListener("mousedown", startMusic);
    window.addEventListener("touchend", startMusic, { passive: true });
    window.addEventListener("click", startMusic);
    window.addEventListener("keydown", startMusic);
    return removeListeners;
  }, [guestSide]);

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

  const toggleMusic = () => {
    if (musicOn) {
      setMusicOn(false);
      pendingPlayRef.current = false;
      playerRef.current?.pauseVideo();
      return;
    }
    // This runs inside the button's onClick, which is itself a valid
    // user-activation gesture, so playVideo() here is safe on mobile too.
    setMusicOn(true);
    setShowMusicHint(false);
    if (playerReadyRef.current && playerRef.current) {
      playerRef.current.playVideo();
    } else {
      pendingPlayRef.current = true;
    }
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
        <div id="music-player" />
      </div>

      {guestSide === null && <GuestSideOverlay onSelect={setGuestSide} />}

      <MusicControl
        musicOn={musicOn}
        showHint={showMusicHint}
        onToggle={toggleMusic}
      />

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
          onChange={() => setGuestSide(null)}
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
