import { useSyncExternalStore } from "react";

const STORAGE_KEY = "anthropic-api-key";
const CHANGE_EVENT = "anthropic-api-key-changed";

export function storeApiKey(apiKey: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, apiKey);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function readApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(STORAGE_KEY);
}

export function clearApiKey() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Subscribes to API key changes made anywhere in the tab (e.g. the settings dialog). Returns an unsubscribe function. */
export function subscribeApiKeyChange(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}

function getHasApiKeySnapshot(): boolean {
  return Boolean(readApiKey());
}

function getHasApiKeyServerSnapshot(): boolean {
  return false;
}

/** Tracks whether an API key is currently stored, staying in sync across tabs/components without manual effects. */
export function useHasApiKey(): boolean {
  return useSyncExternalStore(subscribeApiKeyChange, getHasApiKeySnapshot, getHasApiKeyServerSnapshot);
}
