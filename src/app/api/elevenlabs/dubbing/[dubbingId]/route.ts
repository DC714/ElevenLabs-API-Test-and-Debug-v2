import { ELEVENLABS_API_BASE, getApiKeyOrError, relayJson } from "@/lib/elevenlabs/proxy";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ dubbingId: string }> }) {
  const result = getApiKeyOrError(request);
  if ("error" in result) return result.error;

  const { dubbingId } = await params;
  const response = await fetch(`${ELEVENLABS_API_BASE}/v1/dubbing/${dubbingId}`, {
    headers: { "xi-api-key": result.apiKey },
  });

  return relayJson(response);
}
