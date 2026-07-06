"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MessageStream } from "@anthropic-ai/sdk/lib/MessageStream";
import { usePreferences } from "@/components/PreferencesProvider";
import { diagnosisResultSchema, type DiagnosisResult } from "@/types/diagnosis";
import { InputPanel, type InputPanelSubmission } from "./InputPanel";
import { LoadingState } from "./LoadingState";
import { StreamingAnswer } from "./StreamingAnswer";
import { DiagnosisResultCard } from "./DiagnosisResultCard";

type State =
  | { status: "idle" }
  | { status: "thinking"; text: string }
  | { status: "done"; result: DiagnosisResult }
  | { status: "error"; message: string };

export function DiagnosisWorkspace() {
  const locale = useLocale();
  const tInput = useTranslations("input");
  const tResult = useTranslations("result");
  const [state, setState] = useState<State>({ status: "idle" });
  const { hasAnthropicKey: hasApiKey } = usePreferences();

  async function handleSubmit(submission: InputPanelSubmission) {
    if (!hasApiKey) return;

    setState({ status: "thinking", text: "" });

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, ...submission }),
      });

      if (!response.ok || !response.body) {
        setState({ status: "error", message: tInput("errorGeneric") });
        return;
      }

      const stream = MessageStream.fromReadableStream(response.body);

      stream.on("thinking", (_delta, snapshot) => {
        setState({ status: "thinking", text: snapshot });
      });

      stream.on("error", () => {
        setState({ status: "error", message: tInput("errorGeneric") });
      });

      const message = await stream.finalMessage();
      const parsed = diagnosisResultSchema.safeParse(message.parsed_output);

      if (!parsed.success) {
        setState({ status: "error", message: tInput("errorGeneric") });
        return;
      }

      setState({ status: "done", result: parsed.data });
    } catch {
      setState({ status: "error", message: tInput("errorGeneric") });
    }
  }

  const submitting = state.status === "thinking";

  return (
    <div className="mx-auto grid h-full max-w-6xl grid-cols-1 gap-6 p-6 lg:grid-cols-[420px_1fr]">
      <section className="rounded-2xl border border-[var(--neutral-200)] bg-[var(--white-50)]">
        <InputPanel onSubmit={handleSubmit} submitting={submitting} hasApiKey={hasApiKey} />
      </section>

      <section className="rounded-2xl border border-[var(--neutral-200)] bg-[var(--white-50)]">
        {state.status === "idle" && (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-[var(--neutral-500)]">
            <p className="tracking-display text-xl font-light text-[var(--neutral-400)]">{tResult("idleTitle")}</p>
            <p className="max-w-xs text-sm">{tResult("idleBody")}</p>
          </div>
        )}
        {state.status === "thinking" && (state.text ? <StreamingAnswer thinkingText={state.text} /> : <LoadingState />)}
        {state.status === "error" && (
          <div className="p-6">
            <p className="text-sm text-[var(--accent-red-600)]">{state.message}</p>
          </div>
        )}
        {state.status === "done" && (
          <DiagnosisResultCard result={state.result} onReset={() => setState({ status: "idle" })} />
        )}
      </section>
    </div>
  );
}
