"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useConversation } from "@elevenlabs/react";
import { usePreferences } from "@/components/PreferencesProvider";

interface TranscriptEntry {
  role: "user" | "agent";
  message: string;
}

export function ConversationalAiDemo() {
  const t = useTranslations("demoConversationalAi");
  const tDemo = useTranslations("demo");
  const { hasElevenLabsKey: hasApiKey } = usePreferences();

  const [agentId, setAgentId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);

  const conversation = useConversation({
    onMessage: ({ message, role }) => {
      setTranscript((prev) => [...prev, { role, message }]);
    },
    onError: () => {
      setError(t("errorGeneric"));
    },
  });

  async function handleStart() {
    setError(null);
    setTranscript([]);

    if (!hasApiKey) {
      setError(tDemo("apiKeyRequired"));
      return;
    }
    if (!agentId.trim()) {
      setError(t("validationAgentId"));
      return;
    }

    setConnecting(true);
    try {
      const response = await fetch(
        `/api/elevenlabs/convai/signed-url?agentId=${encodeURIComponent(agentId.trim())}`,
      );
      if (!response.ok) {
        setError(t("errorGeneric"));
        return;
      }
      const { signed_url: signedUrl } = (await response.json()) as { signed_url: string };
      conversation.startSession({ signedUrl });
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setConnecting(false);
    }
  }

  const connected = conversation.status === "connected";

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <label htmlFor="agent-id" className="mb-1.5 block text-sm font-medium text-[var(--neutral-900)]">
          {t("agentIdLabel")}
        </label>
        <input
          id="agent-id"
          value={agentId}
          onChange={(event) => setAgentId(event.target.value)}
          placeholder={t("agentIdPlaceholder")}
          disabled={connected}
          className="w-full max-w-sm rounded-lg border border-[var(--neutral-200)] px-3 py-2 text-sm text-[var(--neutral-950)] focus:border-[var(--neutral-500)] focus:outline-none disabled:opacity-60"
        />
      </div>

      {error && <p className="text-sm text-[var(--accent-red-600)]">{error}</p>}

      <div className="flex items-center gap-2">
        {!connected ? (
          <button
            type="button"
            onClick={() => void handleStart()}
            disabled={connecting}
            className="min-h-11 rounded-xl bg-[var(--neutral-950)] px-4 py-2 text-[15px] font-semibold text-[var(--eggshell)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {connecting ? t("connecting") : t("startButton")}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => conversation.endSession()}
              className="min-h-11 rounded-xl border border-[var(--accent-red-600)] px-4 py-2 text-[15px] font-semibold text-[var(--accent-red-600)]"
            >
              {t("endButton")}
            </button>
            <button
              type="button"
              onClick={() => conversation.setMuted(!conversation.isMuted)}
              className="min-h-11 rounded-xl border border-[var(--neutral-200)] px-4 py-2 text-[15px] font-semibold text-[var(--neutral-900)] hover:bg-[var(--neutral-50)]"
            >
              {conversation.isMuted ? t("unmuteButton") : t("muteButton")}
            </button>
          </>
        )}
      </div>

      <p className="text-sm text-[var(--neutral-600)]">
        {t("statusLabel")}: <span className="font-semibold">{t(`statuses.${conversation.status}`)}</span>
        {connected && conversation.isSpeaking && (
          <span className="ml-2 text-[var(--accent-orange-600)]">{t("speakingIndicator")}</span>
        )}
        {connected && !conversation.isSpeaking && (
          <span className="ml-2 text-[var(--neutral-500)]">{t("listeningIndicator")}</span>
        )}
      </p>

      {transcript.length > 0 && (
        <div className="border-t border-[var(--neutral-200)] pt-4">
          <h3 className="mb-2 text-sm font-semibold text-[var(--neutral-900)]">{t("transcriptHeading")}</h3>
          <ul className="flex flex-col gap-2">
            {transcript.map((entry, index) => (
              <li key={index} className="text-sm">
                <span className="font-semibold text-[var(--neutral-900)]">
                  {entry.role === "user" ? "→ " : "← "}
                </span>
                <span className="text-[var(--neutral-700)]">{entry.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
