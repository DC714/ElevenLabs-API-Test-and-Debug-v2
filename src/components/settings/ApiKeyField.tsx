"use client";

import { useState } from "react";

export function ApiKeyField({
  provider,
  hasKey,
  onSaved,
  inputId,
  title,
  helpText,
  placeholder,
  getKeyLabel,
  getKeyUrl,
  apiKeyLabel,
  saveLabel,
  savedLabel,
  clearLabel,
}: {
  provider: "anthropicApiKey" | "elevenlabsApiKey";
  hasKey: boolean;
  onSaved: () => void;
  inputId: string;
  title: string;
  helpText: string;
  placeholder: string;
  getKeyLabel: string;
  getKeyUrl: string;
  apiKeyLabel: string;
  saveLabel: string;
  savedLabel: string;
  clearLabel: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function patchKey(value: string | null) {
    setBusy(true);
    try {
      await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [provider]: value }),
      });
      onSaved();
    } finally {
      setBusy(false);
    }
  }

  async function handleSave() {
    if (!inputValue.trim()) return;
    await patchKey(inputValue.trim());
    setInputValue("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleClear() {
    await patchKey(null);
    setInputValue("");
  }

  return (
    <div>
      <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-[var(--neutral-950)]">
        <span
          aria-hidden
          className={`h-2 w-2 rounded-full ${hasKey ? "bg-[var(--accent-orange-500)]" : "bg-[var(--neutral-300)]"}`}
        />
        {title}
      </p>
      <p className="mb-3 text-sm text-[var(--neutral-600)]">{helpText}</p>

      <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-[var(--neutral-900)]">
        {apiKeyLabel}
      </label>
      <input
        id={inputId}
        type="password"
        autoComplete="off"
        spellCheck={false}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder={placeholder}
        className="mb-3 w-full rounded-lg border border-[var(--neutral-200)] px-3 py-2 text-sm text-[var(--neutral-950)] focus:border-[var(--neutral-500)] focus:outline-none"
      />

      <a
        href={getKeyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-4 inline-block text-sm text-[var(--neutral-700)] underline underline-offset-2"
      >
        {getKeyLabel}
      </a>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={busy}
          className="min-h-10 flex-1 rounded-xl bg-[var(--neutral-950)] px-4 text-sm font-semibold text-[var(--eggshell)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saved ? savedLabel : saveLabel}
        </button>
        {hasKey && (
          <button
            type="button"
            onClick={handleClear}
            disabled={busy}
            className="min-h-10 rounded-xl border border-[var(--neutral-200)] px-4 text-sm font-semibold text-[var(--neutral-900)] hover:bg-[var(--neutral-50)] disabled:opacity-50"
          >
            {clearLabel}
          </button>
        )}
      </div>
    </div>
  );
}
