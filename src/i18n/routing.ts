import { defineRouting } from "next-intl/routing";

export const locales = [
  "en-US",
  "pl",
  "es",
  "pt-BR",
  "pt-PT",
  "el",
  "nl",
] as const;

export type AppLocale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en-US",
  localePrefix: "always",
});
