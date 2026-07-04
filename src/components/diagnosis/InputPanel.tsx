"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ImageDropzone, type DropzoneImage } from "./ImageDropzone";
import { storeDiagnosisRequest } from "@/lib/diagnosis-session";

export function InputPanel() {
  const t = useTranslations("input");
  const locale = useLocale();
  const router = useRouter();

  const [textInput, setTextInput] = useState("");
  const [images, setImages] = useState<DropzoneImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!textInput.trim() && images.length === 0) {
      setError(t("validationEmpty"));
      return;
    }

    setSubmitting(true);
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

    storeDiagnosisRequest(id, {
      locale,
      textInput: textInput.trim() || undefined,
      images: images.length > 0 ? images : undefined,
    });

    router.push(`/diagnose/${id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <div>
        <h2 className="text-lg font-semibold">{t("heading")}</h2>
        <p className="text-sm opacity-70">{t("subheading")}</p>
      </div>

      <div>
        <label htmlFor="error-text" className="mb-1 block text-sm font-medium">
          {t("textLabel")}
        </label>
        <textarea
          id="error-text"
          value={textInput}
          onChange={(event) => setTextInput(event.target.value)}
          placeholder={t("textPlaceholder")}
          rows={6}
          className="w-full rounded-xl border border-black/15 p-3 text-base dark:border-white/20"
        />
      </div>

      <ImageDropzone images={images} onChange={setImages} onError={setError} />

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="min-h-11 rounded-full bg-black px-4 py-2 text-base font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {submitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
