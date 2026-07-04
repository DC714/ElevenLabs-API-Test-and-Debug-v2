"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MessageStream } from "@anthropic-ai/sdk/lib/MessageStream";
import { readDiagnosisRequest } from "@/lib/diagnosis-session";
import { diagnosisResultSchema, type DiagnosisResult } from "@/types/diagnosis";
import { LoadingState } from "./LoadingState";
import { StreamingAnswer } from "./StreamingAnswer";
import { DiagnosisResultCard } from "./DiagnosisResultCard";

type State =
  | { status: "loading" }
  | { status: "thinking"; text: string }
  | { status: "done"; result: DiagnosisResult }
  | { status: "error"; message: string };

export function DiagnosisRunner({ diagnosisId }: { diagnosisId: string }) {
  const t = useTranslations("input");
  const [state, setState] = useState<State>({ status: "loading" });
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    void run();

    async function run() {
      const request = readDiagnosisRequest(diagnosisId);
      if (!request) {
        setState({ status: "error", message: t("errorGeneric") });
        return;
      }

      try {
        const response = await fetch("/api/diagnose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        });

        if (!response.ok || !response.body) {
          setState({ status: "error", message: t("errorGeneric") });
          return;
        }

        const stream = MessageStream.fromReadableStream(response.body);

        stream.on("thinking", (_delta, snapshot) => {
          setState({ status: "thinking", text: snapshot });
        });

        stream.on("error", () => {
          setState({ status: "error", message: t("errorGeneric") });
        });

        const message = await stream.finalMessage();
        const parsed = diagnosisResultSchema.safeParse(message.parsed_output);

        if (!parsed.success) {
          setState({ status: "error", message: t("errorGeneric") });
          return;
        }

        setState({ status: "done", result: parsed.data });
      } catch {
        setState({ status: "error", message: t("errorGeneric") });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagnosisId]);

  if (state.status === "loading") return <LoadingState />;
  if (state.status === "thinking") return <StreamingAnswer thinkingText={state.text} />;
  if (state.status === "error") {
    return (
      <div className="p-4">
        <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
      </div>
    );
  }
  return <DiagnosisResultCard result={state.result} />;
}
