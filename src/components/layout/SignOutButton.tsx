"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const t = useTranslations("nav");
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="flex min-h-9 items-center rounded-lg border border-[var(--neutral-200)] px-3 text-sm font-medium text-[var(--neutral-900)] transition-colors hover:border-[var(--neutral-300)] hover:bg-[var(--neutral-50)]"
    >
      {t("signOut")}
    </button>
  );
}
