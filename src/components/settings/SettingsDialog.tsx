"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePreferences } from "@/components/PreferencesProvider";
import { ApiKeyField } from "./ApiKeyField";

export function SettingsDialog() {
  const t = useTranslations("settings");
  const [open, setOpen] = useState(false);
  const { hasAnthropicKey, hasElevenLabsKey, refresh } = usePreferences();

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="flex min-h-9 items-center gap-2 rounded-lg border border-[var(--neutral-200)] px-3 text-sm font-medium text-[var(--neutral-900)] transition-colors hover:border-[var(--neutral-300)] hover:bg-[var(--neutral-50)]"
      >
        <span
          aria-hidden
          className={`h-2 w-2 rounded-full ${
            hasAnthropicKey && hasElevenLabsKey ? "bg-[var(--accent-orange-500)]" : "bg-[var(--neutral-300)]"
          }`}
        />
        {t("triggerLabel")}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t("title")}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-4 pt-24 sm:items-center sm:pt-0"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-[var(--neutral-200)] bg-[var(--eggshell)] p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="tracking-display text-lg font-light text-[var(--neutral-950)]">{t("title")}</p>

            <ApiKeyField
              provider="anthropicApiKey"
              hasKey={hasAnthropicKey}
              onSaved={refresh}
              inputId="anthropic-api-key"
              title={t("anthropic.title")}
              helpText={t("anthropic.help")}
              placeholder={t("anthropic.placeholder")}
              getKeyLabel={t("anthropic.getKeyLink")}
              getKeyUrl="https://console.anthropic.com/settings/keys"
              apiKeyLabel={t("apiKeyLabel")}
              saveLabel={t("save")}
              savedLabel={t("saved")}
              clearLabel={t("clear")}
            />

            <hr className="border-[var(--neutral-200)]" />

            <ApiKeyField
              provider="elevenlabsApiKey"
              hasKey={hasElevenLabsKey}
              onSaved={refresh}
              inputId="elevenlabs-api-key"
              title={t("elevenlabs.title")}
              helpText={t("elevenlabs.help")}
              placeholder={t("elevenlabs.placeholder")}
              getKeyLabel={t("elevenlabs.getKeyLink")}
              getKeyUrl="https://elevenlabs.io/app/settings/api-keys"
              apiKeyLabel={t("apiKeyLabel")}
              saveLabel={t("save")}
              savedLabel={t("saved")}
              clearLabel={t("clear")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
