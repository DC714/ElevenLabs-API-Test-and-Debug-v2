import { useTranslations } from "next-intl";

/** Shows the model's live reasoning as it streams in, before the final structured result is ready. */
export function StreamingAnswer({ thinkingText }: { thinkingText: string }) {
  const t = useTranslations("result");

  return (
    <div className="flex flex-col gap-2 p-4" role="status" aria-live="polite">
      <div className="flex items-center gap-2 text-sm opacity-70">
        <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
        {t("loadingText")}
      </div>
      <p className="whitespace-pre-wrap text-sm opacity-80">{thinkingText}</p>
    </div>
  );
}
