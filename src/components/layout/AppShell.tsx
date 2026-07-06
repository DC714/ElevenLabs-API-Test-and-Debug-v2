import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NavTabs } from "./NavTabs";
import { SettingsDialog } from "@/components/settings/SettingsDialog";

export function AppShell({ children }: { children: ReactNode }) {
  const t = useTranslations("app");

  return (
    <div className="flex min-h-full flex-col bg-[var(--eggshell)]">
      <header
        className="border-b border-[var(--neutral-200)] bg-[var(--eggshell)]"
        style={{ paddingTop: "max(0, env(safe-area-inset-top))" }}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="min-w-0">
              <h1 className="tracking-display truncate text-xl text-[var(--neutral-950)]">{t("title")}</h1>
              <p className="truncate text-xs text-[var(--neutral-500)]">{t("tagline")}</p>
            </div>
            <NavTabs />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <SettingsDialog />
            <LanguageSwitcher />
          </div>
        </div>
      </header>
      <main className="flex-1" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        {children}
      </main>
    </div>
  );
}
