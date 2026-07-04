import { useTranslations } from "next-intl";

export function LoadingState() {
  const t = useTranslations("result");

  return (
    <div className="flex flex-col gap-3 p-6" role="status" aria-live="polite">
      <div className="flex items-center gap-2 text-sm text-[var(--neutral-600)]">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent-orange-500)]" />
        {t("loadingText")}
      </div>
      <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--neutral-100)]" />
      <div className="h-4 w-full animate-pulse rounded bg-[var(--neutral-100)]" />
      <div className="h-4 w-5/6 animate-pulse rounded bg-[var(--neutral-100)]" />
    </div>
  );
}
