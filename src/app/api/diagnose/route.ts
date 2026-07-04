import { NextResponse } from "next/server";
import { diagnoseRequestSchema } from "@/types/diagnosis";
import { runDiagnosis } from "@/lib/anthropic/diagnose";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = diagnoseRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const stream = runDiagnosis(parsed.data);
    return new Response(stream.toReadableStream(), {
      headers: { "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Diagnosis request failed", error);
    return NextResponse.json({ error: "Diagnosis failed" }, { status: 500 });
  }
}
