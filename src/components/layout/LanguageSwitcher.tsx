"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

const NATIVE_NAMES: Record<AppLocale, string> = {
  "en-US": "English (US)",
  pl: "Polski",
  es: "Español",
  "pt-BR": "Português (Brasil)",
  "pt-PT": "Português (Portugal)",
  el: "Ελληνικά",
  nl: "Nederlands",
};

export function LanguageSwitcher() {
  const t = useTranslations("languageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function selectLocale(next: AppLocale) {
    setOpen(false);
    router.replace(pathname, { locale: next });
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="flex min-h-9 items-center rounded-lg border border-[var(--neutral-200)] px-3 text-sm font-medium text-[var(--neutral-900)] transition-colors hover:border-[var(--neutral-300)] hover:bg-[var(--neutral-50)]"
      >
        {NATIVE_NAMES[locale as AppLocale]}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t("pickerTitle")}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 sm:items-start sm:justify-end sm:bg-transparent"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full rounded-t-2xl border border-[var(--neutral-200)] bg-[var(--eggshell)] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-xl sm:absolute sm:right-6 sm:top-20 sm:w-64 sm:rounded-xl sm:p-2 sm:shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="mb-2 px-2 text-sm font-semibold text-[var(--neutral-900)] sm:hidden">{t("pickerTitle")}</p>
            <ul>
              {routing.locales.map((code) => (
                <li key={code}>
                  <button
                    type="button"
                    onClick={() => selectLocale(code)}
                    className={`flex min-h-11 w-full items-center rounded-lg px-3 text-left text-base sm:min-h-9 sm:text-sm ${
                      code === locale
                        ? "bg-[var(--neutral-100)] font-semibold text-[var(--neutral-950)]"
                        : "text-[var(--neutral-800)] hover:bg-[var(--neutral-50)]"
                    }`}
                  >
                    {NATIVE_NAMES[code]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
