"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: signInError } = await authClient.signIn.email({ email, password });

    if (signInError) {
      setError(t("errorGeneric"));
      setSubmitting(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleSocial(provider: "google" | "github") {
    setError(null);
    await authClient.signIn.social({ provider, callbackURL: "/" });
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-[var(--eggshell)] p-6">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--neutral-200)] bg-[var(--white-50)] p-6">
        <h1 className="tracking-display text-2xl text-[var(--neutral-950)]">{t("loginTitle")}</h1>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-[var(--neutral-900)]">
              {t("emailLabel")}
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-[var(--neutral-200)] px-3 py-2 text-sm text-[var(--neutral-950)] focus:border-[var(--neutral-500)] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-[var(--neutral-900)]">
              {t("passwordLabel")}
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-[var(--neutral-200)] px-3 py-2 text-sm text-[var(--neutral-950)] focus:border-[var(--neutral-500)] focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-[var(--accent-red-600)]">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="min-h-11 rounded-xl bg-[var(--neutral-950)] px-4 py-2 text-[15px] font-semibold text-[var(--eggshell)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? t("signingIn") : t("loginButton")}
          </button>
        </form>

        <div className="my-4 flex items-center gap-2 text-xs text-[var(--neutral-400)]">
          <div className="h-px flex-1 bg-[var(--neutral-200)]" />
          {t("orDivider")}
          <div className="h-px flex-1 bg-[var(--neutral-200)]" />
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => handleSocial("google")}
            className="min-h-11 rounded-xl border border-[var(--neutral-200)] px-4 text-sm font-semibold text-[var(--neutral-900)] hover:bg-[var(--neutral-50)]"
          >
            {t("continueWithGoogle")}
          </button>
          <button
            type="button"
            onClick={() => handleSocial("github")}
            className="min-h-11 rounded-xl border border-[var(--neutral-200)] px-4 text-sm font-semibold text-[var(--neutral-900)] hover:bg-[var(--neutral-50)]"
          >
            {t("continueWithGitHub")}
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-[var(--neutral-600)]">
          {t("noAccount")}{" "}
          <Link href="/register" className="font-semibold text-[var(--neutral-950)] underline underline-offset-2">
            {t("registerLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
