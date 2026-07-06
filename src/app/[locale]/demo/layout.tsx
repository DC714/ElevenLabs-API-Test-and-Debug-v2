import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DemoSidebar } from "@/components/demo/DemoSidebar";

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 p-6 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-[var(--neutral-200)] bg-[var(--white-50)]">
          <DemoSidebar />
        </aside>
        <div className="rounded-2xl border border-[var(--neutral-200)] bg-[var(--white-50)]">{children}</div>
      </div>
    </AppShell>
  );
}
