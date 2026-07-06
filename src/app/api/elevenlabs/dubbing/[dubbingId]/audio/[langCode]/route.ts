import { ELEVENLABS_API_BASE, getApiKeyOrError, relayBinary } from "@/lib/elevenlabs/proxy";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ dubbingId: string; langCode: string }> },
) {
  const result = await getApiKeyOrError();
  if ("error" in result) return result.error;

  const { dubbingId, langCode } = await params;
  const response = await fetch(`${ELEVENLABS_API_BASE}/v1/dubbing/${dubbingId}/audio/${langCode}`, {
    headers: { "xi-api-key": result.apiKey },
  });

  return relayBinary(response);
}
