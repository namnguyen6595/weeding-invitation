"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { type GuestSide, type GuestSideConfig } from "@/app/components/wedding/constants";

type FamilyContextValue = {
  guestSide: GuestSide | null;
  setGuestSide: (side: GuestSide | null) => void;
  guestContext: GuestSideConfig | null;
};

const FamilyContext = createContext<FamilyContextValue | undefined>(undefined);

export function FamilyContextProvider({ children }: { children: ReactNode }) {
  const [guestSide, setGuestSide] = useState<GuestSide | null>(null);
  const [configs, setConfigs] = useState<Partial<Record<GuestSide, GuestSideConfig>>>({});
  useEffect(() => {
    let cancelled = false;
    fetch("/api/wedding-config", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load wedding config");
        return response.json();
      })
      .then((payload: { configs?: Partial<Record<GuestSide, GuestSideConfig>> }) => {
        if (!cancelled && payload.configs) setConfigs(payload.configs);
      })
      .catch(() => {
        if (!cancelled) setConfigs({});
      });
    return () => { cancelled = true; };
  }, []);
  const guestContext = guestSide ? configs[guestSide] ?? null : null;
  const value = useMemo(() => ({ guestSide, setGuestSide, guestContext }), [guestSide, guestContext]);

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
}

export function useFamilyContext() {
  const context = useContext(FamilyContext);
  if (!context) throw new Error("useFamilyContext must be used within FamilyContextProvider");
  return context;
}
