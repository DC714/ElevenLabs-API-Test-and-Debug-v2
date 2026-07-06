"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { elevenLabsKeySession } from "@/lib/api-key-session";
import { elevenLabsHeaders } from "@/lib/elevenlabs/client-fetch";
import type { ElevenLabsVoice } from "@/lib/elevenlabs/types";
import { useMediaRecorder } from "@/lib/use-media-recorder";

type ListState =
  | { status: "idle" }
  | { status: "error" }
  | { status: "loaded"; voices: ElevenLabsVoice[] };

/** Pure fetch, no React state — safe to call from an effect or an event handler alike. */
async function fetchVoicesData(): Promise<ElevenLabsVoice[]> {
  const response = await fetch("/api/elevenlabs/voices", { headers: elevenLabsHeaders() });
  if (!response.ok) throw new Error("failed to load voices");
  const data = (await response.json()) as { voices: ElevenLabsVoice[] };
  return data.voices ?? [];
}

export function VoicesDemo() {
  const t = useTranslations("demoVoices");
  const tDemo = useTranslations("demo");
  const hasApiKey = elevenLabsKeySession.useHasValue();
  const [listState, setListState] = useState<ListState>({ status: "idle" });

  const [cloneName, setCloneName] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [cloning, setCloning] = useState(false);
  const [cloneError, setCloneError] = useState<string | null>(null);
  const [cloneSuccess, setCloneSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recorder = useMediaRecorder();

  useEffect(() => {
    if (!hasApiKey) return;
    void load();

    async function load() {
      try {
        setListState({ status: "loaded", voices: await fetchVoicesData() });
      } catch {
        setListState({ status: "error" });
      }
    }
  }, [hasApiKey]);

  async function handleClone() {
    setCloneError(null);
    setCloneSuccess(false);

    if (!hasApiKey) {
      setCloneError(tDemo("apiKeyRequired"));
      return;
    }
    if (!cloneName.trim()) {
      setCloneError(t("validationName"));
      return;
    }
    const sample = recorder.blob ?? uploadedFile;
    if (!sample) {
      setCloneError(t("validationSample"));
      return;
    }

    setCloning(true);
    try {
      const formData = new FormData();
      formData.set("name", cloneName.trim());
      formData.set("files", sample, sample instanceof File ? sample.name : "sample.webm");

      const response = await fetch("/api/elevenlabs/voices/clone", {
        method: "POST",
        headers: elevenLabsHeaders(),
        body: formData,
      });

      if (!response.ok) {
        setCloneError(t("cloneError"));
        return;
      }

      setCloneSuccess(true);
      setCloneName("");
      setUploadedFile(null);
      recorder.reset();
      setListState({ status: "loaded", voices: await fetchVoicesData() });
    } catch {
      setCloneError(t("cloneError"));
    } finally {
      setCloning(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[var(--neutral-950)]">{t("listHeading")}</h2>

        {!hasApiKey && <p className="text-sm text-[var(--accent-red-600)]">{tDemo("apiKeyRequired")}</p>}
        {hasApiKey && listState.status === "idle" && (
          <p className="text-sm text-[var(--neutral-600)]">{t("loadingVoices")}</p>
        )}
        {hasApiKey && listState.status === "error" && (
          <p className="text-sm text-[var(--accent-red-600)]">{t("errorLoadingVoices")}</p>
        )}
        {hasApiKey && listState.status === "loaded" && listState.voices.length === 0 && (
          <p className="text-sm text-[var(--neutral-600)]">{t("noVoices")}</p>
        )}
        {hasApiKey && listState.status === "loaded" && listState.voices.length > 0 && (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {listState.voices.map((voice) => (
              <li
                key={voice.voice_id}
                className="rounded-xl border border-[var(--neutral-200)] p-3 text-sm"
              >
                <p className="font-semibold text-[var(--neutral-950)]">{voice.name}</p>
                {voice.category && <p className="text-xs text-[var(--neutral-500)]">{voice.category}</p>}
                {voice.preview_url && (
                  <audio controls src={voice.preview_url} className="mt-2 w-full" />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="border-t border-[var(--neutral-200)] pt-6">
        <h2 className="mb-3 text-lg font-semibold text-[var(--neutral-950)]">{t("cloneHeading")}</h2>

        <div className="flex max-w-sm flex-col gap-3">
          <div>
            <label htmlFor="clone-name" className="mb-1 block text-sm font-medium text-[var(--neutral-900)]">
              {t("cloneNameLabel")}
            </label>
            <input
              id="clone-name"
              value={cloneName}
              onChange={(event) => setCloneName(event.target.value)}
              placeholder={t("cloneNamePlaceholder")}
              className="w-full rounded-lg border border-[var(--neutral-200)] px-3 py-2 text-sm text-[var(--neutral-950)] focus:border-[var(--neutral-500)] focus:outline-none"
            />
          </div>

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
            <label htmlFor="clone-upload" className="mb-1 block text-sm font-medium text-[var(--neutral-900)]">
              {t("uploadLabel")}
            </label>
            <input
              id="clone-upload"
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={(event) => setUploadedFile(event.target.files?.[0] ?? null)}
              className="w-full text-sm"
            />
          </div>

          {cloneError && <p className="text-sm text-[var(--accent-red-600)]">{cloneError}</p>}
          {cloneSuccess && <p className="text-sm text-[var(--accent-orange-600)]">{t("cloneSuccess")}</p>}

          <button
            type="button"
            onClick={handleClone}
            disabled={cloning}
            className="min-h-11 w-fit rounded-xl bg-[var(--neutral-950)] px-4 py-2 text-[15px] font-semibold text-[var(--eggshell)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {cloning ? t("cloning") : t("cloneSubmit")}
          </button>
        </div>
      </section>
    </div>
  );
}
