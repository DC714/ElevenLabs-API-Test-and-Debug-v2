import { NextResponse } from "next/server";
import { APIError } from "@anthropic-ai/sdk";
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

    // Wait for the Anthropic response to actually connect before streaming it back, so an
    // immediate failure (e.g. an invalid API key) surfaces as a clean JSON error instead of
    // an aborted connection once we've already started piping a Response body.
    await stream.withResponse();

    return new Response(stream.toReadableStream(), {
      headers: { "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Diagnosis request failed", error);
    const status = error instanceof APIError ? error.status : undefined;
    return NextResponse.json(
      { error: "Diagnosis failed" },
      { status: status ?? 500 },
    );
  }
}
