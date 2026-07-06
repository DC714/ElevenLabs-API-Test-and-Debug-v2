"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { usePreferences } from "@/components/PreferencesProvider";
import type { DubbingProject } from "@/lib/elevenlabs/types";
import { DUBBING_LANGUAGES } from "@/lib/dubbing-languages";

const POLL_INTERVAL_MS = 4000;
const TERMINAL_STATUSES = new Set(["dubbed", "failed"]);

export function DubbingDemo() {
  const t = useTranslations("demoDubbing");
  const tDemo = useTranslations("demo");
  const { hasElevenLabsKey: hasApiKey } = usePreferences();

  const [file, setFile] = useState<File | null>(null);
  const [targetLang, setTargetLang] = useState<string>(DUBBING_LANGUAGES[1].code);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expectedDuration, setExpectedDuration] = useState<number | null>(null);
  const [project, setProject] = useState<DubbingProject | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const resultUrlRef = useRef<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  async function pollStatus(dubbingId: string) {
    const response = await fetch(`/api/elevenlabs/dubbing/${dubbingId}`);
    if (!response.ok) return;
    const data = (await response.json()) as DubbingProject;
    setProject(data);

    if (TERMINAL_STATUSES.has(data.status)) {
      stopPolling();
      if (data.status === "dubbed") {
        await fetchResultAudio(dubbingId);
      }
    }
  }

  async function fetchResultAudio(dubbingId: string) {
    const response = await fetch(`/api/elevenlabs/dubbing/${dubbingId}/audio/${targetLang}`);
    if (!response.ok) return;
    const blob = await response.blob();
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    const url = URL.createObjectURL(blob);
    resultUrlRef.current = url;
    setResultUrl(url);
  }

  async function handleStart() {
    setError(null);
    setProject(null);
    setResultUrl(null);
    setExpectedDuration(null);

    if (!hasApiKey) {
      setError(tDemo("apiKeyRequired"));
      return;
    }
    if (!file) {
      setError(t("validationFile"));
      return;
    }

    setStarting(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("target_lang", targetLang);

      const response = await fetch("/api/elevenlabs/dubbing", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setError(t("errorGeneric"));
        return;
      }

      const data = (await response.json()) as { dubbing_id: string; expected_duration_sec?: number };
      setExpectedDuration(data.expected_duration_sec ?? null);
      setProject({ dubbing_id: data.dubbing_id, status: "queued" });

      pollRef.current = setInterval(() => void pollStatus(data.dubbing_id), POLL_INTERVAL_MS);
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setStarting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex max-w-sm flex-col gap-3">
        <div>
          <label htmlFor="dubbing-file" className="mb-1 block text-sm font-medium text-[var(--neutral-900)]">
            {t("uploadLabel")}
          </label>
          <input
            id="dubbing-file"
            type="file"
            accept="audio/*,video/*"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="w-full text-sm"
          />
        </div>

        <div>
          <label htmlFor="dubbing-lang" className="mb-1 block text-sm font-medium text-[var(--neutral-900)]">
            {t("targetLanguageLabel")}
          </label>
          <select
            id="dubbing-lang"
            value={targetLang}
            onChange={(event) => setTargetLang(event.target.value)}
            className="w-full rounded-lg border border-[var(--neutral-200)] px-3 py-2 text-sm text-[var(--neutral-950)] focus:border-[var(--neutral-500)] focus:outline-none"
          >
            {DUBBING_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-[var(--accent-red-600)]">{error}</p>}

        <button
          type="button"
          onClick={handleStart}
          disabled={starting}
          className="min-h-11 w-fit rounded-xl bg-[var(--neutral-950)] px-4 py-2 text-[15px] font-semibold text-[var(--eggshell)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {starting ? t("starting") : t("submitButton")}
        </button>
      </div>

      {project && (
        <div className="border-t border-[var(--neutral-200)] pt-4">
          <p className="text-sm text-[var(--neutral-700)]">
            {t("statusLabel")}: <span className="font-semibold">{t(`statuses.${project.status}`)}</span>
          </p>
          {expectedDuration !== null && project.status !== "dubbed" && (
            <p className="mt-1 text-sm text-[var(--neutral-500)]">
              {t("expectedDuration", { seconds: Math.round(expectedDuration) })}
            </p>
          )}
        </div>
      )}

      {resultUrl && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-[var(--neutral-900)]">{t("resultHeading")}</h3>
          <audio controls src={resultUrl} className="w-full max-w-sm" />
        </div>
      )}
    </div>
  );
}
