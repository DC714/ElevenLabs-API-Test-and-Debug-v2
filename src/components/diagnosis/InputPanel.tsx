"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ImageDropzone, type DropzoneImage } from "./ImageDropzone";

export interface InputPanelSubmission {
  textInput?: string;
  images?: DropzoneImage[];
}

export function InputPanel({
  onSubmit,
  submitting,
  hasApiKey,
}: {
  onSubmit: (submission: InputPanelSubmission) => void;
  submitting: boolean;
  hasApiKey: boolean;
}) {
  const t = useTranslations("input");

  const [textInput, setTextInput] = useState("");
  const [images, setImages] = useState<DropzoneImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!hasApiKey) {
      setError(t("apiKeyRequired"));
      return;
    }

    if (!textInput.trim() && images.length === 0) {
      setError(t("validationEmpty"));
      return;
    }

    onSubmit({
      textInput: textInput.trim() || undefined,
      images: images.length > 0 ? images : undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col gap-5 p-6">
      <div>
        <h2 className="tracking-display text-2xl font-light text-[var(--neutral-950)]">{t("heading")}</h2>
        <p className="mt-1 text-sm text-[var(--neutral-600)]">{t("subheading")}</p>
      </div>

      <div>
        <label htmlFor="error-text" className="mb-1.5 block text-sm font-medium text-[var(--neutral-900)]">
          {t("textLabel")}
        </label>
        <textarea
          id="error-text"
          value={textInput}
          onChange={(event) => setTextInput(event.target.value)}
          placeholder={t("textPlaceholder")}
          rows={8}
          className="w-full rounded-xl border border-[var(--neutral-200)] p-3 text-[15px] text-[var(--neutral-950)] placeholder:text-[var(--neutral-400)] focus:border-[var(--neutral-500)] focus:outline-none"
        />
      </div>

      <ImageDropzone images={images} onChange={setImages} onError={setError} />

      {error && <p className="text-sm text-[var(--accent-red-600)]">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-auto min-h-11 rounded-xl bg-[var(--neutral-950)] px-4 py-2 text-[15px] font-semibold text-[var(--eggshell)] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
