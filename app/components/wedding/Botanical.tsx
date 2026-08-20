import { memo } from "react";

export const Botanical = memo(function Botanical({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 130 210" aria-hidden="true"><path d="M63 207c5-69 8-134 48-196" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M77 151C50 142 33 122 27 93c28 4 47 21 53 46M87 116c-2-31 8-58 31-79 9 32 0 60-28 82M68 180c-22-4-40-17-52-40 28-2 46 10 54 31" fill="none" stroke="currentColor" strokeWidth="1.1" /></svg>;
});
