"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { type GuestSide, type GuestSideConfig } from "@/app/components/wedding/constants";

type FamilyContextValue = {
  guestSide: GuestSide | null;
  setGuestSide: (side: GuestSide | null) => void;
  guestContext: GuestSideConfig | null;
  musicUrls: Partial<Record<GuestSide, string>>;
  isConfigLoading: boolean;
};

const FamilyContext = createContext<FamilyContextValue | undefined>(undefined);

export function FamilyContextProvider({ children }: { children: ReactNode }) {
  const [guestSide, setGuestSide] = useState<GuestSide | null>(null);
  const [configs, setConfigs] = useState<Partial<Record<GuestSide, GuestSideConfig>>>({});
  const [isConfigLoading, setIsConfigLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/wedding-config", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load wedding config");
        return response.json();
      })
      .then((payload: { configs?: Partial<Record<GuestSide, GuestSideConfig>> }) => {
        if (!cancelled) {
          setConfigs(payload.configs ?? {});
          setIsConfigLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setConfigs({});
          setIsConfigLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);
  const guestContext = guestSide ? configs[guestSide] ?? null : null;
  const musicUrls = useMemo(() => Object.fromEntries(Object.entries(configs).map(([side, config]) => [side, config?.musicUrl ?? ""])) as Partial<Record<GuestSide, string>>, [configs]);
  const value = useMemo(() => ({ guestSide, setGuestSide, guestContext, musicUrls, isConfigLoading }), [guestSide, guestContext, musicUrls, isConfigLoading]);

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
}

export function useFamilyContext() {
  const context = useContext(FamilyContext);
  if (!context) throw new Error("useFamilyContext must be used within FamilyContextProvider");
  return context;
}
