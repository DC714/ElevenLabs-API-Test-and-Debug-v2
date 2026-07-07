import { useTranslations } from "next-intl";

export function AuthIntroPanel() {
  const t = useTranslations("auth");

  return (
    <div className="flex flex-col justify-center gap-4 bg-[var(--neutral-950)] p-6 text-[var(--eggshell)] md:p-8">
      <h2 className="tracking-display text-xl">{t("introTitle")}</h2>
      <p className="text-sm text-[var(--neutral-300)]">{t("introBody")}</p>
      <div className="h-px bg-[var(--neutral-800)]" />
      <p className="text-sm text-[var(--neutral-300)]">{t("keysExplanation")}</p>
      <p className="text-sm text-[var(--neutral-400)]">{t("keysSecurity")}</p>
    </div>
  );
}
