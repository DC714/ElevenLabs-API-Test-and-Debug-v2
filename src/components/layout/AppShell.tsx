import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function AppShell({ children }: { children: ReactNode }) {
  const t = useTranslations("app");

  return (
    <div className="flex min-h-full flex-col">
      <header
        className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-3 dark:border-white/10"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold">{t("title")}</h1>
          <p className="truncate text-xs opacity-70">{t("tagline")}</p>
        </div>
        <LanguageSwitcher />
      </header>
      <main
        className="flex-1"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {children}
      </main>
    </div>
  );
}
