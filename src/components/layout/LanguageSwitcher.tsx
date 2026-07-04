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
        className="min-h-11 min-w-11 rounded-full border border-black/15 px-3 text-sm font-medium dark:border-white/20"
      >
        {NATIVE_NAMES[locale as AppLocale]}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t("pickerTitle")}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full rounded-t-2xl bg-[var(--background)] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-xl sm:w-80 sm:rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="mb-2 px-2 text-sm font-semibold">{t("pickerTitle")}</p>
            <ul>
              {routing.locales.map((code) => (
                <li key={code}>
                  <button
                    type="button"
                    onClick={() => selectLocale(code)}
                    className={`flex min-h-11 w-full items-center rounded-lg px-3 text-left text-base ${
                      code === locale ? "bg-black/5 font-semibold dark:bg-white/10" : ""
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
