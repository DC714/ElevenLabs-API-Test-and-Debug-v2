"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { DiagnosisResult } from "@/types/diagnosis";

const SEVERITY_STYLES: Record<DiagnosisResult["severity"], string> = {
  low: "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100",
  medium: "bg-amber-200 text-amber-900 dark:bg-amber-700 dark:text-amber-50",
  high: "bg-orange-200 text-orange-900 dark:bg-orange-700 dark:text-orange-50",
  critical: "bg-red-200 text-red-900 dark:bg-red-700 dark:text-red-50",
};

export function DiagnosisResultCard({ result }: { result: DiagnosisResult }) {
  const t = useTranslations("result");
  const router = useRouter();
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
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`min-h-7 rounded-full px-3 py-1 text-xs font-semibold ${SEVERITY_STYLES[result.severity]}`}
        >
          {t(`severity.${result.severity}`)}
        </span>
        <span className="text-xs opacity-70">
          {t("confidenceLabel")}: {result.confidence}
        </span>
        {result.matchedKbId && (
          <span className="text-xs opacity-70">{t("matchedEntry", { id: result.matchedKbId })}</span>
        )}
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold">{t("diagnosisHeading")}</h3>
        <p className="whitespace-pre-wrap text-base">{result.diagnosis}</p>
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold">{t("remediationHeading")}</h3>
        <ol className="flex flex-col gap-2">
          {result.remediationSteps.map((step, index) => (
            <li
              key={index}
              className="min-h-11 rounded-xl border border-black/10 p-3 text-sm dark:border-white/10"
            >
              <span className="mr-2 font-semibold">{index + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {result.relatedDocs.length > 0 && (
        <div>
          <h3 className="mb-1 text-sm font-semibold">{t("relatedDocsHeading")}</h3>
          <ul className="flex flex-col gap-1">
            {result.relatedDocs.map((doc) => (
              <li key={doc.url}>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline underline-offset-2"
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
          className="min-h-11 flex-1 rounded-full border border-black/15 px-4 text-sm font-semibold dark:border-white/20"
        >
          {copied ? t("copiedConfirmation") : t("copyButton")}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="min-h-11 flex-1 rounded-full bg-black px-4 text-sm font-semibold text-white dark:bg-white dark:text-black"
        >
          {t("retryButton")}
        </button>
      </div>
    </div>
  );
}
