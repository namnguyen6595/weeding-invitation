import { memo } from "react";
import { useFamilyContext } from "@/app/context/FamilyContext";

export const WeddingFooter = memo(function WeddingFooter() {
  const { guestContext } = useFamilyContext();
  return <footer><p>Thank you</p><h2>Nam <i>&amp;</i> Mai</h2><span className="numeric">{guestContext?.date.display}</span></footer>;
});
