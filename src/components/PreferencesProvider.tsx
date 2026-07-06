"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

interface PreferencesState {
  locale: string;
  hasAnthropicKey: boolean;
  hasElevenLabsKey: boolean;
  loaded: boolean;
}

interface PreferencesContextValue extends PreferencesState {
  refresh: () => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PreferencesState>({
    locale: "en-US",
    hasAnthropicKey: false,
    hasElevenLabsKey: false,
    loaded: false,
  });

  const refresh = useCallback(async () => {
    const response = await fetch("/api/user/preferences");
    if (!response.ok) return;
    const data = (await response.json()) as Omit<PreferencesState, "loaded">;
    setState({ ...data, loaded: true });
  }, []);

  useEffect(() => {
    void load();

    async function load() {
      await refresh();
    }
  }, [refresh]);

  return <PreferencesContext.Provider value={{ ...state, refresh }}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
