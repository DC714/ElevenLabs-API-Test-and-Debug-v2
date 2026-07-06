import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { DEMO_APIS } from "@/lib/demo-apis";

export default async function DemoLandingPage() {
  const t = await getTranslations("demo");

  return (
    <div className="p-6">
      <h2 className="tracking-display text-2xl text-[var(--neutral-950)]">{t("landingTitle")}</h2>
      <p className="mt-1 text-sm text-[var(--neutral-600)]">{t("landingSubtitle")}</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {DEMO_APIS.map((api) => (
          <Link
            key={api.slug}
            href={`/demo/${api.slug}`}
            className="rounded-xl border border-[var(--neutral-200)] p-4 transition-colors hover:border-[var(--neutral-300)] hover:bg-[var(--neutral-50)]"
          >
            <h3 className="font-semibold text-[var(--neutral-950)]">{t(`apis.${api.key}.title`)}</h3>
            <p className="mt-1 text-sm text-[var(--neutral-600)]">{t(`apis.${api.key}.description`)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
