"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { usePreferences } from "@/components/PreferencesProvider";
import { base64ChunksToBlob, generateTtsStream } from "@/lib/elevenlabs/tts-socket";
import type { ElevenLabsVoice } from "@/lib/elevenlabs/types";

type VoicesState =
  | { status: "idle" }
  | { status: "error" }
  | { status: "loaded"; voices: ElevenLabsVoice[] };

export function TtsDemo() {
  const t = useTranslations("demoTextToSpeech");
  const tDemo = useTranslations("demo");
  const { hasElevenLabsKey: hasApiKey } = usePreferences();

  const [voicesState, setVoicesState] = useState<VoicesState>({ status: "idle" });
  const [voiceId, setVoiceId] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "connecting" | "generating">("idle");
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const audioUrlRef = useRef<string | null>(null);
  const cancelRef = useRef<(() => void) | null>(null);
  const chunksRef = useRef<string[]>([]);

  useEffect(() => {
    if (!hasApiKey) return;
    void loadVoices();

    async function loadVoices() {
      try {
        const response = await fetch("/api/elevenlabs/voices");
        if (!response.ok) throw new Error("failed");
        const data = (await response.json()) as { voices: ElevenLabsVoice[] };
        setVoicesState({ status: "loaded", voices: data.voices ?? [] });
        if (data.voices?.[0]) setVoiceId(data.voices[0].voice_id);
      } catch {
        setVoicesState({ status: "error" });
      }
    }
  }, [hasApiKey]);

  useEffect(() => {
    return () => {
      cancelRef.current?.();
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  async function handleGenerate() {
    setError(null);

    if (!hasApiKey) {
      setError(tDemo("apiKeyRequired"));
      return;
    }
    if (!voiceId) {
      setError(t("validationVoice"));
      return;
    }
    if (!text.trim()) {
      setError(t("validationEmpty"));
      return;
    }

    setStatus("connecting");

    const revealResponse = await fetch("/api/user/elevenlabs-key/reveal");
    if (!revealResponse.ok) {
      setError(tDemo("apiKeyRequired"));
      setStatus("idle");
      return;
    }
    const { apiKey } = (await revealResponse.json()) as { apiKey: string };

    cancelRef.current?.();
    chunksRef.current = [];

    cancelRef.current = generateTtsStream({
      voiceId,
      apiKey,
      text: text.trim(),
      onAudioChunk: (chunk) => {
        chunksRef.current.push(chunk);
        setStatus("generating");
      },
      onDone: () => {
        const blob = base64ChunksToBlob(chunksRef.current);
        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;
        setAudioUrl(url);
        setStatus("idle");
      },
      onError: () => {
        setError(t("errorGeneric"));
        setStatus("idle");
      },
    });
  }

  const busy = status !== "idle";

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <label htmlFor="tts-voice" className="mb-1.5 block text-sm font-medium text-[var(--neutral-900)]">
          {t("voiceLabel")}
        </label>
        {!hasApiKey && <p className="text-sm text-[var(--accent-red-600)]">{tDemo("apiKeyRequired")}</p>}
        {hasApiKey && voicesState.status === "idle" && (
          <p className="text-sm text-[var(--neutral-600)]">{t("loadingVoices")}</p>
        )}
        {hasApiKey && voicesState.status === "error" && (
          <p className="text-sm text-[var(--accent-red-600)]">{t("errorLoadingVoices")}</p>
        )}
        {hasApiKey && voicesState.status === "loaded" && (
          <select
            id="tts-voice"
            value={voiceId}
            onChange={(event) => setVoiceId(event.target.value)}
            className="w-full max-w-sm rounded-lg border border-[var(--neutral-200)] px-3 py-2 text-sm text-[var(--neutral-950)] focus:border-[var(--neutral-500)] focus:outline-none"
          >
            {voicesState.voices.map((voice) => (
              <option key={voice.voice_id} value={voice.voice_id}>
                {voice.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label htmlFor="tts-text" className="mb-1.5 block text-sm font-medium text-[var(--neutral-900)]">
          {t("textLabel")}
        </label>
        <textarea
          id="tts-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={t("textPlaceholder")}
          rows={5}
          className="w-full max-w-sm rounded-xl border border-[var(--neutral-200)] p-3 text-[15px] text-[var(--neutral-950)] placeholder:text-[var(--neutral-400)] focus:border-[var(--neutral-500)] focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-[var(--accent-red-600)]">{error}</p>}

      <button
        type="button"
        onClick={() => void handleGenerate()}
        disabled={busy}
        className="min-h-11 w-fit rounded-xl bg-[var(--neutral-950)] px-4 py-2 text-[15px] font-semibold text-[var(--eggshell)] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "connecting" ? t("connecting") : status === "generating" ? t("generating") : t("generateButton")}
      </button>

      {audioUrl && (
        <audio controls autoPlay src={audioUrl} className="w-full max-w-sm" />
      )}
    </div>
  );
}
