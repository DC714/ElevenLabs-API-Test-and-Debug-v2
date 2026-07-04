import type { routing } from "@/i18n/routing";
import type messages from "@/messages/en-US.json";

declare module "use-intl/core" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
