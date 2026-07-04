import { AppShell } from "@/components/layout/AppShell";
import { DiagnosisRunner } from "@/components/diagnosis/DiagnosisRunner";

export default async function DiagnosisResultPage({
  params,
}: {
  params: Promise<{ diagnosisId: string }>;
}) {
  const { diagnosisId } = await params;

  return (
    <AppShell>
      <DiagnosisRunner diagnosisId={diagnosisId} />
    </AppShell>
  );
}
