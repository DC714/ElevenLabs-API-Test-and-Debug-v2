import { useSyncExternalStore } from "react";

export interface SessionValue {
  store: (value: string) => void;
  read: () => string | null;
  clear: () => void;
  subscribe: (callback: () => void) => () => void;
  useHasValue: () => boolean;
}

/** Creates a sessionStorage-backed value with change notifications, reusable for any per-tab credential. */
export function createSessionValue(storageKey: string): SessionValue {
  const changeEvent = `${storageKey}-changed`;

  function store(value: string) {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(storageKey, value);
    window.dispatchEvent(new Event(changeEvent));
  }

  function read(): string | null {
    if (typeof window === "undefined") return null;
    return window.sessionStorage.getItem(storageKey);
  }

  function clear() {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(storageKey);
    window.dispatchEvent(new Event(changeEvent));
  }

  function subscribe(callback: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    window.addEventListener(changeEvent, callback);
    return () => window.removeEventListener(changeEvent, callback);
  }

  function getSnapshot(): boolean {
    return Boolean(read());
  }

  function getServerSnapshot(): boolean {
    return false;
  }

  function useHasValue(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  }

  return { store, read, clear, subscribe, useHasValue };
}
