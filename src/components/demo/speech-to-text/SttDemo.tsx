"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePreferences } from "@/components/PreferencesProvider";
import type { SpeechToTextResult } from "@/lib/elevenlabs/types";
import { useMediaRecorder } from "@/lib/use-media-recorder";

export function SttDemo() {
  const t = useTranslations("demoSpeechToText");
  const tDemo = useTranslations("demo");
  const { hasElevenLabsKey: hasApiKey } = usePreferences();
  const recorder = useMediaRecorder();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SpeechToTextResult | null>(null);

  async function handleTranscribe() {
    setError(null);
    setResult(null);

    if (!hasApiKey) {
      setError(tDemo("apiKeyRequired"));
      return;
    }
    const sample = recorder.blob ?? uploadedFile;
    if (!sample) {
      setError(t("validationSample"));
      return;
    }

    setTranscribing(true);
    try {
      const formData = new FormData();
      formData.set("model_id", "scribe_v1");
      formData.set("file", sample, sample instanceof File ? sample.name : "clip.webm");

      const response = await fetch("/api/elevenlabs/stt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setError(t("errorGeneric"));
        return;
      }

      setResult((await response.json()) as SpeechToTextResult);
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setTranscribing(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h2 className="mb-3 text-lg font-semibold text-[var(--neutral-950)]">{t("heading")}</h2>

        <div className="flex max-w-sm flex-col gap-3">
          <div className="flex items-center gap-2">
            {recorder.status !== "recording" ? (
              <button
                type="button"
                onClick={() => void recorder.start()}
                className="min-h-10 rounded-xl border border-[var(--neutral-200)] px-3 text-sm font-semibold text-[var(--neutral-900)] hover:bg-[var(--neutral-50)]"
              >
                {t("recordButton")}
              </button>
            ) : (
              <button
                type="button"
                onClick={recorder.stop}
                className="min-h-10 rounded-xl border border-[var(--accent-red-600)] px-3 text-sm font-semibold text-[var(--accent-red-600)]"
              >
                {t("stopButton")}
              </button>
            )}
            {recorder.status === "recording" && (
              <span className="text-sm text-[var(--neutral-600)]">{t("recordingLabel")}</span>
            )}
            {recorder.blob && recorder.status === "stopped" && (
              <span className="text-sm text-[var(--neutral-600)]">{t("recordedLabel")}</span>
            )}
          </div>
          {recorder.error && <p className="text-sm text-[var(--accent-red-600)]">{t("micDenied")}</p>}

          <div>
            <label htmlFor="stt-upload" className="mb-1 block text-sm font-medium text-[var(--neutral-900)]">
              {t("uploadLabel")}
            </label>
            <input
              id="stt-upload"
              type="file"
              accept="audio/*,video/*"
              onChange={(event) => setUploadedFile(event.target.files?.[0] ?? null)}
              className="w-full text-sm"
            />
          </div>

          {error && <p className="text-sm text-[var(--accent-red-600)]">{error}</p>}

          <button
            type="button"
            onClick={handleTranscribe}
            disabled={transcribing}
            className="min-h-11 w-fit rounded-xl bg-[var(--neutral-950)] px-4 py-2 text-[15px] font-semibold text-[var(--eggshell)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {transcribing ? t("transcribing") : t("submitButton")}
          </button>
        </div>
      </div>

      {result && (
        <div className="border-t border-[var(--neutral-200)] pt-6">
          <h3 className="mb-2 text-sm font-semibold text-[var(--neutral-900)]">{t("transcriptHeading")}</h3>
          <p className="whitespace-pre-wrap text-[15px] text-[var(--neutral-950)]">{result.text}</p>
        </div>
      )}
    </div>
  );
}
