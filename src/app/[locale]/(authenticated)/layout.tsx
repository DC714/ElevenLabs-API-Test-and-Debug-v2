import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PreferencesProvider } from "@/components/PreferencesProvider";

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <PreferencesProvider>
      <AppShell>{children}</AppShell>
    </PreferencesProvider>
  );
}
