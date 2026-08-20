type MusicControlProps = { musicOn: boolean; showHint: boolean; onToggle: () => void };

export function MusicControl({ musicOn, showHint, onToggle }: MusicControlProps) {
  return <button className={`music-control ${musicOn ? "is-playing" : ""} ${showHint && !musicOn ? "hint-pulse" : ""}`} type="button" onClick={onToggle} aria-label={musicOn ? "Tắt nhạc" : "Bật nhạc"}><span className="music-bars" aria-hidden="true"><i /><i /><i /></span><span>{musicOn ? "Music on" : "Music off"}</span></button>;
}
