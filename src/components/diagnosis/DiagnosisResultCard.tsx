"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { DiagnosisResult } from "@/types/diagnosis";

const SEVERITY_STYLES: Record<DiagnosisResult["severity"], string> = {
  low: "bg-[var(--neutral-100)] text-[var(--neutral-800)]",
  medium: "bg-[var(--accent-orange-100)] text-[var(--accent-orange-800)]",
  high: "bg-[var(--accent-orange-600)] text-[var(--eggshell)]",
  critical: "bg-[var(--accent-red-600)] text-[var(--eggshell)]",
};

export function DiagnosisResultCard({
  result,
  onReset,
}: {
  result: DiagnosisResult;
  onReset: () => void;
}) {
  const t = useTranslations("result");
  const [copied, setCopied] = useState(false);

  async function copyToClipboard() {
    const text = [
      result.diagnosis,
      "",
      `${t("remediationHeading")}:`,
      ...result.remediationSteps.map((step, i) => `${i + 1}. ${step}`),
    ].join("\n");

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`min-h-7 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${SEVERITY_STYLES[result.severity]}`}
        >
          {t(`severity.${result.severity}`)}
        </span>
        <span className="text-xs text-[var(--neutral-500)]">
          {t("confidenceLabel")}: {result.confidence}
        </span>
        {result.matchedKbId && (
          <span className="text-xs text-[var(--neutral-500)]">{t("matchedEntry", { id: result.matchedKbId })}</span>
        )}
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold text-[var(--neutral-900)]">{t("diagnosisHeading")}</h3>
        <p className="whitespace-pre-wrap text-[15px] text-[var(--neutral-950)]">{result.diagnosis}</p>
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold text-[var(--neutral-900)]">{t("remediationHeading")}</h3>
        <ol className="flex flex-col gap-2">
          {result.remediationSteps.map((step, index) => (
            <li
              key={index}
              className="min-h-11 rounded-xl border border-[var(--neutral-200)] p-3 text-[15px] text-[var(--neutral-950)]"
            >
              <span className="mr-2 font-semibold">{index + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {result.relatedDocs.length > 0 && (
        <div>
          <h3 className="mb-1 text-sm font-semibold text-[var(--neutral-900)]">{t("relatedDocsHeading")}</h3>
          <ul className="flex flex-col gap-1">
            {result.relatedDocs.map((doc) => (
              <li key={doc.url}>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--neutral-700)] underline underline-offset-2"
                >
                  {doc.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={copyToClipboard}
          className="min-h-11 flex-1 rounded-xl border border-[var(--neutral-200)] px-4 text-sm font-semibold text-[var(--neutral-900)] hover:bg-[var(--neutral-50)]"
        >
          {copied ? t("copiedConfirmation") : t("copyButton")}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="min-h-11 flex-1 rounded-xl bg-[var(--neutral-950)] px-4 text-sm font-semibold text-[var(--eggshell)] hover:opacity-90"
        >
          {t("retryButton")}
        </button>
      </div>
    </div>
  );
}
