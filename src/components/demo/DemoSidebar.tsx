"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { DEMO_APIS } from "@/lib/demo-apis";

export function DemoSidebar() {
  const t = useTranslations("demo.apis");
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto p-3 lg:flex-col lg:overflow-visible lg:p-4">
      {DEMO_APIS.map((api) => {
        const href = `/demo/${api.slug}`;
        const active = pathname === href;
        return (
          <Link
            key={api.slug}
            href={href}
            className={`shrink-0 rounded-xl px-3 py-2 text-sm font-medium transition-colors lg:shrink ${
              active
                ? "bg-[var(--neutral-950)] text-[var(--eggshell)]"
                : "text-[var(--neutral-700)] hover:bg-[var(--neutral-50)]"
            }`}
          >
            {t(`${api.key}.title`)}
          </Link>
        );
      })}
    </nav>
  );
}
