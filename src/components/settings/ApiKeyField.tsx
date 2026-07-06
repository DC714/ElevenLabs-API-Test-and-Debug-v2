"use client";

import { useState } from "react";
import type { SessionValue } from "@/lib/session-value";

export function ApiKeyField({
  session,
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
  session: SessionValue;
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
  const hasKey = session.useHasValue();
  const [inputValue, setInputValue] = useState(() => session.read() ?? "");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    if (!inputValue.trim()) return;
    session.store(inputValue.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleClear() {
    session.clear();
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
          className="min-h-10 flex-1 rounded-xl bg-[var(--neutral-950)] px-4 text-sm font-semibold text-[var(--eggshell)] transition-opacity hover:opacity-90"
        >
          {saved ? savedLabel : saveLabel}
        </button>
        {hasKey && (
          <button
            type="button"
            onClick={handleClear}
            className="min-h-10 rounded-xl border border-[var(--neutral-200)] px-4 text-sm font-semibold text-[var(--neutral-900)] hover:bg-[var(--neutral-50)]"
          >
            {clearLabel}
          </button>
        )}
      </div>
    </div>
  );
}
