"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { usePreferences } from "@/components/PreferencesProvider";

export function SoundEffectsDemo() {
  const t = useTranslations("demoSoundEffects");
  const tDemo = useTranslations("demo");
  const { hasElevenLabsKey: hasApiKey } = usePreferences();

  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  async function handleGenerate() {
    setError(null);

    if (!hasApiKey) {
      setError(tDemo("apiKeyRequired"));
      return;
    }
    if (!prompt.trim()) {
      setError(t("validationEmpty"));
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch("/api/elevenlabs/sound-effects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: prompt.trim(), duration_seconds: duration }),
      });

      if (!response.ok) {
        setError(t("errorGeneric"));
        return;
      }

      const blob = await response.blob();
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;
      setAudioUrl(url);
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <label htmlFor="sfx-prompt" className="mb-1.5 block text-sm font-medium text-[var(--neutral-900)]">
          {t("promptLabel")}
        </label>
        <textarea
          id="sfx-prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder={t("promptPlaceholder")}
          rows={4}
          className="w-full rounded-xl border border-[var(--neutral-200)] p-3 text-[15px] text-[var(--neutral-950)] placeholder:text-[var(--neutral-400)] focus:border-[var(--neutral-500)] focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="sfx-duration" className="mb-1.5 block text-sm font-medium text-[var(--neutral-900)]">
          {t("durationLabel")}: {duration}s
        </label>
        <input
          id="sfx-duration"
          type="range"
          min={0.5}
          max={30}
          step={0.5}
          value={duration}
          onChange={(event) => setDuration(Number(event.target.value))}
          className="w-full max-w-sm"
        />
      </div>

      {error && <p className="text-sm text-[var(--accent-red-600)]">{error}</p>}

      <button
        type="button"
        onClick={handleGenerate}
        disabled={generating}
        className="min-h-11 w-fit rounded-xl bg-[var(--neutral-950)] px-4 py-2 text-[15px] font-semibold text-[var(--eggshell)] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {generating ? t("generating") : t("generateButton")}
      </button>

      {audioUrl && (
        <audio controls src={audioUrl} className="w-full max-w-sm" />
      )}
    </div>
  );
}
