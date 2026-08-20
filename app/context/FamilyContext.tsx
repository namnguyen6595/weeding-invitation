"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { GUEST_SIDES, type GuestSide, type GuestSideConfig } from "@/app/components/wedding/constants";

type FamilyContextValue = {
  guestSide: GuestSide | null;
  setGuestSide: (side: GuestSide | null) => void;
  guestContext: GuestSideConfig | null;
};

const FamilyContext = createContext<FamilyContextValue | undefined>(undefined);

export function FamilyContextProvider({ children }: { children: ReactNode }) {
  const [guestSide, setGuestSide] = useState<GuestSide | null>(null);
  const guestContext = guestSide ? GUEST_SIDES[guestSide] : null;
  const value = useMemo(() => ({ guestSide, setGuestSide, guestContext }), [guestSide, guestContext]);

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
}

export function useFamilyContext() {
  const context = useContext(FamilyContext);
  if (!context) throw new Error("useFamilyContext must be used within FamilyContextProvider");
  return context;
}
