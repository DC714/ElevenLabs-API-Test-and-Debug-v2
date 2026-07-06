"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function NavTabs() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isDemo = pathname.startsWith("/demo");

  const tabClass = (active: boolean) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
      active
        ? "bg-[var(--neutral-950)] text-[var(--eggshell)]"
        : "text-[var(--neutral-700)] hover:bg-[var(--neutral-50)]"
    }`;

  return (
    <nav className="flex shrink-0 items-center gap-1">
      <Link href="/" className={tabClass(!isDemo)}>
        {t("diagnose")}
      </Link>
      <Link href="/demo" className={tabClass(isDemo)}>
        {t("demo")}
      </Link>
    </nav>
  );
}
