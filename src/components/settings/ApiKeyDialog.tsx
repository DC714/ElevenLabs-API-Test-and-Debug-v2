"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { clearApiKey, readApiKey, storeApiKey, useHasApiKey } from "@/lib/api-key-session";

export function ApiKeyDialog() {
  const t = useTranslations("settings");
  const [open, setOpen] = useState(false);
  const hasKey = useHasApiKey();
  const [inputValue, setInputValue] = useState("");
  const [saved, setSaved] = useState(false);

  function openDialog() {
    setInputValue(readApiKey() ?? "");
    setSaved(false);
    setOpen(true);
  }

  function handleSave() {
    if (!inputValue.trim()) return;
    storeApiKey(inputValue.trim());
    setSaved(true);
    setTimeout(() => setOpen(false), 600);
  }

  function handleClear() {
    clearApiKey();
    setInputValue("");
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={openDialog}
        aria-haspopup="dialog"
        className="flex min-h-9 items-center gap-2 rounded-lg border border-[var(--neutral-200)] px-3 text-sm font-medium text-[var(--neutral-900)] transition-colors hover:border-[var(--neutral-300)] hover:bg-[var(--neutral-50)]"
      >
        <span
          aria-hidden
          className={`h-2 w-2 rounded-full ${hasKey ? "bg-[var(--accent-orange-500)]" : "bg-[var(--neutral-300)]"}`}
        />
        {t("triggerLabel")}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t("title")}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-4 pt-24 sm:items-center sm:pt-0"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-[var(--neutral-200)] bg-[var(--eggshell)] p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="tracking-display mb-1 text-lg font-light text-[var(--neutral-950)]">{t("title")}</p>
            <p className="mb-4 text-sm text-[var(--neutral-600)]">{t("apiKeyHelp")}</p>

            <label htmlFor="anthropic-api-key" className="mb-1 block text-sm font-medium text-[var(--neutral-900)]">
              {t("apiKeyLabel")}
            </label>
            <input
              id="anthropic-api-key"
              type="password"
              autoComplete="off"
              spellCheck={false}
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder={t("apiKeyPlaceholder")}
              className="mb-3 w-full rounded-lg border border-[var(--neutral-200)] px-3 py-2 text-sm text-[var(--neutral-950)] focus:border-[var(--neutral-500)] focus:outline-none"
            />

            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 inline-block text-sm underline underline-offset-2 text-[var(--neutral-700)]"
            >
              {t("getKeyLink")}
            </a>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="min-h-10 flex-1 rounded-xl bg-[var(--neutral-950)] px-4 text-sm font-semibold text-[var(--eggshell)] transition-opacity hover:opacity-90"
              >
                {saved ? t("saved") : t("save")}
              </button>
              {hasKey && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="min-h-10 rounded-xl border border-[var(--neutral-200)] px-4 text-sm font-semibold text-[var(--neutral-900)] hover:bg-[var(--neutral-50)]"
                >
                  {t("clear")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
